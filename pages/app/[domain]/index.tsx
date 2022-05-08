import { NextAuthPage } from "../../../lib/types";
import { trpc } from "../../../lib/trpc";
import { Loading, TeamLayout, Preview } from "../../../components";
import { useRouter } from "next/router";

const Page: NextAuthPage = () => {
  const router = useRouter();
  const domain = String(router.query.domain);

  const team = trpc.useQuery(["team.get", { domain }]);

  if (team.error) {
    router.push("/");
  }

  return (
    <>
      <Loading query={team}>
        {(team) => <Preview>{JSON.stringify(team, undefined, 2)}</Preview>}
      </Loading>
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
