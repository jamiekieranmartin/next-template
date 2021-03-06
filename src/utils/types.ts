import React, { PropsWithChildren } from "react";
import type { NextPage } from "next";

export type NextLayoutPage<T = {}> = NextPage<T> & {
  auth: boolean;
  Layout?: React.FC<PropsWithChildren<unknown>>;
};
