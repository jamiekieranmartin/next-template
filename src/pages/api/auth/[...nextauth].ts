import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";

export default NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: (token as any).sub,
      },
    }),
  },

  events: {
    createUser: async ({ user }) => {
      // Create a stripe customer for the user with their email address
      await stripe.customers.create({
        name: user.name!,
        email: user.email!,
        metadata: {
          user_id: user.id,
        },
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires?: string;
  }
}
