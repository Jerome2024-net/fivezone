import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fivezone_ai_social_secret",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (user && await compare(credentials.password, user.password)) {
            return { id: user.id, email: user.email, name: user.name }
          }
        } catch (error) {
          console.error("Auth error:", error)
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.userId = user.id }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) { session.user.id = token.userId }
      return session
    }
  }
}
