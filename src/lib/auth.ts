import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import { prisma } from "@/lib/prisma" // REMOVED TO PREVENT CRASH
import { compare } from "bcryptjs"
import { database } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_dev_mode_only", // ENSURE SECRET IS PRESENT
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
            const q = query(usersRef, orderByChild('email'), equalTo(credentials.email));
            const snapshot = await get(q);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                const key = Object.keys(data)[0];
                const firebaseUser = data[key];
                user = {
                    id: key,
                    email: firebaseUser.email,
                    name: firebaseUser.name,
                    password: firebaseUser.password, // This is hashed
                    role: firebaseUser.role,
                }
                isFirebaseUser = true;
                console.log("Firebase Auth: User found", user.email);
            } else {
                console.log("Firebase Auth: User not found");
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

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          return null
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
