import { getToken } from "next-auth/jwt";

import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const token = await getToken({ req });

  return {
    req,
    res,
    token,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
