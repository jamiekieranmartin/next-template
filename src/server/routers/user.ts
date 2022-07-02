import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createProtectedRouter } from "../create-protected-router";

export const userRouter = createProtectedRouter()
  /**
   * Get user
   */
  .query("get", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user_id },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Not found`,
        });
      }

      return user;
    },
  })
  /**
   * Edit user
   */
  .mutation("edit", {
    input: z.object({
      name: z.string().min(1),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.user_id },
        data: {
          name: input.name,
        },
      });
    },
  })
  /**
   * List invitations of a user
   */
  .query("invitations", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.teamMember.findMany({
        where: { user_id: ctx.user_id, accepted: false },
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
   * Accept an invitation
   */
  .mutation("accept", {
    input: z.object({
      team_id: z.string().min(1),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.teamMember.update({
        where: {
          user_id_team_id: {
            user_id: ctx.user_id,
            team_id: input.team_id,
          },
        },
        data: {
          accepted: true,
        },
      });
    },
  });
