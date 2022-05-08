import superjson from "superjson";
import { createRouter } from "../create-router";
import { userRouter } from "./user";
import { teamRouter } from "./team";
import { memberRouter } from "./team_member";
import { publicRouter } from "./public";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("team.", teamRouter)
  .merge("team.member.", memberRouter)
  .merge("public.", publicRouter);

export type AppRouter = typeof appRouter;
