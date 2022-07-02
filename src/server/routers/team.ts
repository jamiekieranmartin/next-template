import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTeamSchema, editTeamSchema } from "../../utils/schemas";
import { createProtectedRouter } from "../create-protected-router";

import { ensureOwner } from "./utils";

export const teamRouter = createProtectedRouter()
  /**
   * List all teams of a user
   */
  .query("list", {
    async resolve({ ctx }) {
      const { user_id } = ctx;
      return await ctx.prisma.team.findMany({
        where: {
          members: {
            some: {
              user_id,
              accepted: true,
            },
          },
        },
      });
    },
  })
  /**
   * Get a team by slug
   */
  .query("get", {
    input: z.object({
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { slug } = input;
      const team = await ctx.prisma.team.findFirst({
        where: {
          slug,
          members: {
            some: {
              user_id,
              accepted: true,
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `You do not have access`,
        });
      }

      return team;
    },
  })
  /**
   * List members of a team
   */
  .query("members", {
    input: z.object({
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { slug } = input;
      return await ctx.prisma.teamMember.findMany({
        where: {
          team: {
            slug,

            members: {
              some: {
                user_id,
                accepted: true,
              },
            },
          },
        },
      });
    },
  })
  /**
   * Create a team
   */
  .mutation("create", {
    input: createTeamSchema,
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { name, slug } = input;
      return await ctx.prisma.team.create({
        data: {
          name,
          slug,

          members: {
            create: {
              user_id,
              accepted: true,
              role: "owner",
            },
          },
        },
      });
    },
  })
  /**
   * Edit a team
   */
  .mutation("edit", {
    input: editTeamSchema,
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { id, slug, name } = input;
      await ensureOwner(slug, user_id);

      return await ctx.prisma.team.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
        },
      });
    },
  })
  /**
   * Delete a team
   */
  .mutation("delete", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { user_id } = ctx;
      const { slug } = input;
      await ensureOwner(slug, user_id);

      await ctx.prisma.teamMember.deleteMany({
        where: {
          team: {
            slug,
          },
        },
      });

      return await ctx.prisma.team.delete({
        where: {
          slug,
        },
      });
    },
  });
