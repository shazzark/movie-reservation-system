// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import dbConnect from "./db";

// Define AuthUser type
interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();
        const userDoc = await User.findOne({ email: credentials.email });
        if (!userDoc || !userDoc.password) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          userDoc.password,
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: userDoc._id.toString(),
          email: userDoc.email,
          name: userDoc.name,
          role: userDoc.role as "user" | "admin",
        };
      },
    })],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as AuthUser).id;
        token.role = (user as AuthUser).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
