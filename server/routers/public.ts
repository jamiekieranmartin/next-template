import { createRouter } from "../create-router";

export const publicRouter = createRouter().query("teams", {
  async resolve({ ctx }) {
    return await ctx.prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },
});
