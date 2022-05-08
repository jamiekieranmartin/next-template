import type { NextPage } from "next";
import React, { PropsWithChildren } from "react";

export type NextAuthPage<T = {}> = NextPage<T> & {
  auth?: boolean;
  Layout?: React.FC<PropsWithChildren<unknown>>;
};
