import { Prisma, Team } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "../create-protected-router";
import { team_create, team_edit } from "../../lib/schema";
import { stripe } from "../../lib/stripe";

const members = (user_id: string): Prisma.TeamMemberListRelationFilter => ({
  some: {
    user_id,
    accepted: true,
  },
});

const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://app.localhost:3000";

export const teamRouter = createProtectedRouter()
  /**
   * List all teams of a user
   */
  .query("list", {
    async resolve({ ctx }) {
      const { user_id } = ctx;

      return await ctx.prisma.team.findMany({
        where: {
          members: members(user_id),
        },
      });
    },
  })
  /**
   * Get a team by domain
   */
  .query("get", {
    input: z.object({
      domain: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { domain } = input;

      const team = await ctx.prisma.team.findFirst({
        where: {
          domain,
          members: members(user_id),
        },
        include: {
          stripe_account: {
            select: {
              default_currency: true,
              charges_enabled: true,
              payouts_enabled: true,
            },
          },
        },
      });

      if (team) return team;

      throw new TRPCError({
        code: "NOT_FOUND",
        message: `You do not have access`,
      });
    },
  })
  /**
   * List members of a team
   */
  .query("members", {
    input: z.object({
      domain: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { domain } = input;

      return await ctx.prisma.teamMember.findMany({
        where: {
          team: {
            domain,
            members: members(user_id),
          },
        },
      });
    },
  })
  /**
   * Create a team
   */
  .mutation("create", {
    input: team_create,
    async resolve({ ctx, input }) {
      const { user_id } = ctx;

      const account = await stripe.accounts.create({
        type: "standard",
        business_type: "non_profit",
      });

      return await ctx.prisma.team.create({
        data: {
          ...input,
          stripe_account: {
            create: {
              stripe_id: account.id,
              default_currency: account.default_currency,
              charges_enabled: account.charges_enabled,
              payouts_enabled: account.payouts_enabled,
            },
          },
          members: {
            create: {
              user_id,
              accepted: true,
              role: "OWNER",
            },
          },
        },
      });
    },
  })
  /**
   * Ensure the user is an owner of the team
   */
  .middleware(async ({ ctx, rawInput, next }) => {
    const { user_id } = ctx;
    const team_id = (rawInput as Team).id;

    const isOwner = await ctx.prisma.teamMember.count({
      where: {
        team_id,
        user_id,
        role: "OWNER",
      },
    });

    if (isOwner) return next();

    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have access`,
    });
  })
  /**
   * Connect Stripe Account
   */
  .mutation("connect", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;

      const team = await ctx.prisma.team.findFirst({
        where: {
          id,
        },
        include: {
          stripe_account: true,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No team found`,
        });

      let account_id = team.stripe_account?.stripe_id;

      if (!account_id) {
        const account = await stripe.accounts.create({
          type: "standard",
          business_type: "non_profit",
        });

        await ctx.prisma.team.update({
          where: {
            id,
          },
          data: {
            stripe_account: {
              create: {
                stripe_id: account.id,
                default_currency: account.default_currency,
                charges_enabled: account.charges_enabled,
                payouts_enabled: account.payouts_enabled,
              },
            },
          },
        });

        account_id = account.id;
      }

      return stripe.accountLinks.create({
        account: account_id,
        refresh_url: `${host}/${team.domain}/settings`,
        return_url: `${host}/${team.domain}/settings`,
        type: "account_onboarding",
      });
    },
  })
  /**
   * Edit a team
   */
  .mutation("edit", {
    input: team_edit,
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;

      return await ctx.prisma.team.update({
        where: {
          id,
        },
        data: rest,
      });
    },
  })
  /**
   * Delete a team
   */
  .mutation("delete", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;

      await ctx.prisma.teamMember.deleteMany({
        where: {
          team_id: id,
        },
      });

      return await ctx.prisma.team.delete({
        where: {
          id,
        },
      });
    },
  });
