import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import { prisma } from "@/lib/prisma" // REMOVED TO PREVENT CRASH
import { compare } from "bcryptjs"
import { database } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debugging to see logs in Railway console
  trustHost: true, // Trust the host header (important for Railway/custom domains)
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_dev_mode_only", 
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Connexion",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        let user = null;
        let isFirebaseUser = false;

        // 1. Try Firebase (PRIMARY DB NOW)
        try {
            const usersRef = ref(database, 'users');
            // Simplified Fetch: Get all users and filter in memory to avoid Index/Query issues
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Loosely find user by email (trim and lowercase safe)
                const searchEmail = credentials.email.toLowerCase().trim();
                
                const foundKey = Object.keys(data).find(key => {
                    const uEmail = data[key]?.email;
                    return uEmail && uEmail.toLowerCase().trim() === searchEmail;
                });

                if (foundKey) {
                    const firebaseUser = data[foundKey];
                    user = {
                        id: foundKey,
                        email: firebaseUser.email,
                        name: firebaseUser.name,
                        password: firebaseUser.password, // This is hashed
                        role: firebaseUser.role,
                    }
                    isFirebaseUser = true;
                    console.log("Firebase Auth: User found", user.email);
                } else {
                     console.log("Firebase Auth: User not found in scan");
                }
            } else {
                console.log("Firebase Auth: No users table");
            }
        } catch (firebaseErr: any) {
            console.error("Firebase Auth Lookup failed:", firebaseErr);
            // Don't throw, just let user be null
        }

        /* PRISMA DISABLED - CAUSED SERVER ERRORS IN PROD
        // 1. Try Prisma (Primary DB)
        try {
            user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            })
        } catch (e: any) {
             console.log("Prisma Auth Failed (Fallback to Firebase):", e.message);
        }
        */

        if (!user || !user.password) {
          console.log("User not found or no password");
          return null
        }

        try {
            const isPasswordValid = await compare(credentials.password, user.password)
            console.log("Password valid:", isPasswordValid);

            if (!isPasswordValid) {
                return null
            }
        } catch (bcryptError) {
            console.error("Bcrypt error:", bcryptError);
            return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        }
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          role: u.role,
        }
      }
      return token
    }
  }
}
