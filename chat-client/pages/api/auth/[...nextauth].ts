import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const loginUserSchema = z.object({
  email: z.string().regex(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g, 'Invalid email'),
  password: z.string().min(4, 'Password should be minimum 4 characters')
})

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'text', placeholder: 'yasmany@gmail.com' },
        password: { type: 'password', placeholder: 'Pa$$w0rd' }
      },
      authorize: async (credentials, req) => {
        const { email, password } = loginUserSchema.parse(credentials);

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return user;
      }
    })
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.accessToken = token;
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        const u = user as User;
        token.accessToken = account.access_token;
        token.email = u.email;
        token.firstname = u.firstname;
        token.lastname = u.lastname;
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.JWT_SECRET
};

export default NextAuth(authOptions);