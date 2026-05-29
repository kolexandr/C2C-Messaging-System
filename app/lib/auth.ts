import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "./prisma"

export const {auth, handlers, signIn, signOut} = NextAuth({
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Wrong credentials")
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            }
          });

          if (!user) {
            throw new Error("User not found")
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordCorrect) {
            throw new Error("Wrong credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        } catch {
          return null
        }

      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET
});
