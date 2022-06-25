import { trpc } from "../trpc";

export type UseMembersProps = {
  slug: string;
};

export const useMembers = ({ slug }: UseMembersProps) => {
  const members = trpc.useQuery(["team.member.list", { slug }]);
  const invitations = trpc.useQuery(["team.member.invitations", { slug }]);

  const utils = trpc.useContext();

  const invite = trpc.useMutation(["team.member.invite"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.member.list", { slug }]);
      await utils.invalidateQueries(["team.member.invitations", { slug }]);
    },
  });

  const remove = trpc.useMutation(["team.member.remove"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.member.list", { slug }]);
      await utils.invalidateQueries(["team.member.invitations", { slug }]);
    },
  });

  return {
    members,
    invitations,
    invite,
    remove,
  };
};
