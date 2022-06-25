import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { createProtectedRouter } from "../create-protected-router";

const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const checkoutRouter = createProtectedRouter()
  /**
   * Get all products
   */
  .query("products", {
    async resolve() {
      return await prisma.product.findMany({
        include: {
          prices: true,
        },
      });
    },
  })
  /**
   * Get the user's subscription.
   */
  .query("subscription", {
    async resolve({ ctx }) {
      const { user_id } = ctx;

      return await prisma.subscription.findFirst({
        where: {
          customer: {
            user_id,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    },
  })
  /**
   * Create checkout session
   */
  .mutation("create", {
    input: z.object({
      price_id: z.string(),
      quantity: z.number().min(1).default(1),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;

      const customer = await prisma.customer.findUnique({
        where: {
          user_id,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Not found`,
        });
      }

      const { price_id, quantity } = input;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer: customer.id,
        line_items: [
          {
            price: price_id,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
        },
        success_url: `${host}/settings`,
        cancel_url: `${host}/`,
      });

      return session;
    },
  })
  /**
   * Create a portal link to Stripe
   */
  .mutation("portal", {
    resolve: async ({ ctx }) => {
      const customer = await prisma.customer.findUnique({
        where: {
          user_id: ctx.user_id,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Not found`,
        });
      }

      const { url } = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${host}/settings`,
      });

      return { url };
    },
  });
