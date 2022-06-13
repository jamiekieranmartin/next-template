import { TeamMember } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { inviteTeamMemberSchema } from "../../lib/schemas";
import { createProtectedRouter } from "../create-protected-router";

export const memberRouter = createProtectedRouter()
  /**
   * Ensure the user is a team member
   */
  .middleware(async ({ ctx, rawInput, next }) => {
    const { user_id } = ctx;
    const team_id = (rawInput as TeamMember).team_id;

    const isMember = await prisma.teamMember.count({
      where: {
        team_id,
        user_id,
      },
    });

    if (isMember) return next();

    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have access`,
    });
  })
  /**
   * List all team members
   */
  .query("list", {
    input: z.object({
      team_id: z.string().cuid(),
    }),
    async resolve({ input }) {
      const { team_id } = input;

      return await prisma.teamMember.findMany({
        where: {
          team_id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
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
      team_id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { team_id } = input;

      const teamMember = await prisma.teamMember.findFirst({
        where: {
          team_id,
          user_id,
        },
      });

      if (teamMember) return teamMember;

      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You do not have access`,
      });
    },
  })
  /**
   * List sent invitations of a team
   */
  .query("invitations", {
    input: z.object({
      team_id: z.string().cuid(),
    }),
    async resolve({ input }) {
      const { team_id } = input;

      return await prisma.teamMember.findMany({
        where: { team_id, accepted: false },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  })
  /**
   * Ensure the user is a team owner
   */
  .middleware(async ({ ctx, rawInput, next }) => {
    const { user_id } = ctx;
    const team_id = (rawInput as TeamMember).team_id;

    const isOwner = await prisma.teamMember.count({
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
   * Invite a user by email to the team
   */
  .mutation("invite", {
    input: inviteTeamMemberSchema,
    async resolve({ input }) {
      const { team_id, email } = input;

      return await prisma.teamMember.create({
        data: {
          team: {
            connect: {
              id: team_id,
            },
          },
          user: {
            connect: {
              email,
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
      team_id: z.string().cuid(),
      user_id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { team_id, user_id } = input;

      if (user_id === user_id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You cannot remove yourself`,
        });

      return await prisma.teamMember.delete({
        where: {
          user_id_team_id: {
            team_id,
            user_id,
          },
        },
      });
    },
  });
