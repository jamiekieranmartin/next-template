import { prisma } from "../../lib/prisma";
import { createRouter } from "../create-router";

export const publicRouter = createRouter().query("teams", {
  async resolve() {
    return await prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },
});
