import { trpc } from "../trpc";

export type UseRoleProps = {
  slug: string;
};

export const useRole = ({ slug }: UseRoleProps) => {
  return trpc.useQuery(["team.member.role", { slug }]);
};
