import * as trpc from "@trpc/server";

import { Context } from "./context";

export function createProtectedRouter() {
  return trpc.router<Context>().middleware(({ ctx, next }) => {
    if (!ctx.token?.sub) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user_id: ctx.token.sub,
      },
    });
  });
}
