import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { database } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"

export const authOptions: NextAuthOptions = {
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

        // 2. Try Firebase (Backup DB) if user not found in Prisma
        if (!user) {
            try {
                const usersRef = ref(database, 'users');
                // Note: Querying by child requires index on 'email' in rules for performance, 
                // but works on small datasets without it.
                // Alternative: Fetch all users and filter (inefficient but safe for MVP without indexes)
                // Let's try direct query first.
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
                    isFirebaseUser = true; // Flag for debugging
                }
            } catch (firebaseErr) {
                console.error("Firebase Auth Lookup failed:", firebaseErr);
            }
        }

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

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
