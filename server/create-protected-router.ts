import * as trpc from "@trpc/server";
import { Context } from "./context";

export function createProtectedRouter() {
  return trpc.router<Context>().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user_id: ctx.session.user.id,
      },
    });
  });
}
