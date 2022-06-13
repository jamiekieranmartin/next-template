import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { createProtectedRouter } from "../create-protected-router";

export const userRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx: { user_id } }) {
      const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (user) return user;

      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Not found`,
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      name: z.string().min(1),
    }),
    resolve: async ({ ctx: { user_id }, input }) => {
      const user = await prisma.user.update({
        where: { id: user_id },
        data: {
          name: input.name,
        },
      });

      return user;
    },
  })
  .query("invitations", {
    resolve: async ({ ctx: { user_id } }) => {
      const invitations = await prisma.teamMember.findMany({
        where: { user_id, accepted: false },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });

      return invitations;
    },
  })
  .mutation("accept", {
    input: z.object({
      team_id: z.string().min(1),
    }),
    resolve: async ({ ctx: { user_id }, input: { team_id } }) => {
      const members = await prisma.teamMember.update({
        where: {
          user_id_team_id: {
            user_id,
            team_id,
          },
        },
        data: {
          accepted: true,
        },
      });

      return members;
    },
  });
