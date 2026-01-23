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
           // 1. Try Prisma (Supabase Postgres)
           const user = await prisma.user.findUnique({
              where: {
                  email: credentials.email
              },
              include: {
                  businesses: true // Include business to check role/ownership if needed
              }
           });

           if (user && await compare(credentials.password, user.password)) {
                
                // Construct user object compatible with NextAuth
                let businessId = null;
                if (user.businesses && user.businesses.length > 0) {
                    businessId = user.businesses[0].id;
                }

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
    // ... callbacks
  }
}
                    user = {
                        id: foundKey,
                        email: firebaseUser.email,
                        name: firebaseUser.name,
                        image: firebaseUser.image || firebaseUser.business?.logoUrl || null,
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
          image: user.image,
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
