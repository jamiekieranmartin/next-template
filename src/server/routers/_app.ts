import transformer from "superjson";

import { createRouter } from "../create-router";

import { checkoutRouter } from "./checkout";
import { publicRouter } from "./public";
import { teamRouter } from "./team";
import { memberRouter } from "./team_member";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(transformer)
  .merge("checkout.", checkoutRouter)
  .merge("user.", userRouter)
  .merge("team.", teamRouter)
  .merge("team.member.", memberRouter)
  .merge("public.", publicRouter);

export type AppRouter = typeof appRouter;
