import { createRouter } from "../create-router";

export const publicRouter = createRouter()
  /**
   * Get token
   */
  .query("token", {
    async resolve({ ctx }) {
      return ctx.token;
    },
  });
