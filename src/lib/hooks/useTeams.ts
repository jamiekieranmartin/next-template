import { useRouter } from "next/router";

import { trpc } from "../trpc";

export const useTeams = () => {
  const router = useRouter();

  const teams = trpc.useQuery(["team.list"]);

  const utils = trpc.useContext();
  const remove = trpc.useMutation(["team.delete"], {
    async onSuccess({ slug }) {
      await utils.invalidateQueries(["team.list"]);
      await utils.invalidateQueries(["team.get", { slug }]);
      router.push("/");
    },
  });

  return {
    teams,
    remove,
  };
};
