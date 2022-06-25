import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { prisma } from "../../lib/prisma";
import { inviteTeamMemberSchema } from "../../lib/schemas";
import { createProtectedRouter } from "../create-protected-router";

import { ensureMember, ensureOwner } from "./utils";

export const memberRouter = createProtectedRouter()
  /**
   * List all team members
   */
  .query("list", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { slug } = input;
      await ensureMember(slug, ctx.user_id);

      return await prisma.teamMember.findMany({
        where: {
          team: {
            slug,
          },
          accepted: true,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    },
  })
  /**
   * Get the role of the user
   */
  .query("role", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { slug } = input;
      await ensureMember(slug, ctx.user_id);

      const teamMember = await prisma.teamMember.findFirst({
        where: {
          team: {
            slug,
          },
          user_id: ctx.user_id,
        },
      });

      if (!teamMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You do not have access`,
        });
      }

      return teamMember;
    },
  })
  /**
   * List sent invitations of a team
   */
  .query("invitations", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { slug } = input;
      await ensureMember(slug, ctx.user_id);

      return await prisma.teamMember.findMany({
        where: {
          team: {
            slug,
          },
          accepted: false,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    },
  })
  /**
   * Invite a user by email to the team
   */
  .mutation("invite", {
    input: inviteTeamMemberSchema,
    async resolve({ ctx, input }) {
      const { slug } = input;
      await ensureOwner(slug, ctx.user_id);

      return await prisma.teamMember.create({
        data: {
          team: {
            connect: {
              slug,
            },
          },
          user: {
            connect: {
              email: input.email,
            },
          },
        },
      });
    },
  })
  /**
   * Remove a user from the team
   */
  .mutation("remove", {
    input: z.object({
      slug: z.string(),
      user_id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.user_id === input.user_id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You cannot remove yourself`,
        });
      }

      const { slug } = input;

      await ensureOwner(slug, ctx.user_id);

      const team = await prisma.team.findUnique({
        where: {
          slug,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Team does not exist`,
        });
      }

      return await prisma.teamMember.delete({
        where: {
          user_id_team_id: {
            team_id: team.id,
            user_id: input.user_id,
          },
        },
      });
    },
  });
