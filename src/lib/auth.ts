import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma" 
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  debug: true,
  trustHost: true,
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

        try {
           const user = await prisma.user.findUnique({
              where: {
                  email: credentials.email
              },
              include: {
                  businesses: true 
              }
           });

           if (user && await compare(credentials.password, user.password)) {
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
           }
        } catch(error) {
            console.error("Prisma Auth Error:", error);
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        if (!token.businessId) {
             try {
                 const dbUser = await prisma.user.findUnique({
                     where: { email: user.email! },
                     include: { businesses: true }
                 })
                 if (dbUser && dbUser.businesses.length > 0) {
                     token.businessId = dbUser.businesses[0].id
                 }
             } catch(e) {}
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).businessId = token.businessId;
      }
      return session
    }
  }
}
