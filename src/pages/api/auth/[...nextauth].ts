import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { prisma } from "@/server/db/client";
import { stripe } from "@/utils/stripe";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

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
      const { id, email, name } = user;
      if (!email) return;

      const customer = await prisma.customer.findUnique({
        where: {
          email,
        },
      });

      if (customer) return;

      // Create a stripe customer for the user with their email address
      await stripe.customers.create({
        name: name ?? undefined,
        email,
        metadata: {
          user_id: id,
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
