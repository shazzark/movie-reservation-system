// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

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

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Use Mongoose to find the user
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
    }),
  ],

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
