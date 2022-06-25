import React, { useContext } from "react";
import { useRouter } from "next/router";
import { UseQueryResult } from "react-query";

import { InferQueryOutput, trpc } from "../trpc";

export type TeamContextInterface = UseQueryResult<InferQueryOutput<"team.get">>;

export const TeamContext =
  React.createContext<TeamContextInterface | null>(null);

export type TeamProviderProps = React.PropsWithChildren & {
  slug: string;
};

export const TeamProvider: React.FC<TeamProviderProps> = ({
  slug,
  ...props
}) => {
  const router = useRouter();

  const team = trpc.useQuery(["team.get", { slug }]);

  if (team.isError) {
    router.push("/");
  }

  return <TeamContext.Provider value={team} {...props} />;
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error(`useTeam must be used within a TeamContextProvider.`);
  }
  return context;
};
