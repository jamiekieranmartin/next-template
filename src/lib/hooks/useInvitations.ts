import { trpc } from "../trpc";

export const useInvitations = () => {
  const invitations = trpc.useQuery(["user.invitations"]);

  const utils = trpc.useContext();
  const accept = trpc.useMutation(["user.accept"], {
    async onSuccess() {
      await utils.invalidateQueries(["user.invitations"]);
      await utils.invalidateQueries(["team.list"]);
    },
  });

  return { invitations, accept };
};
