import { useRouter } from "next/router";

import { Loading, Preview } from "../../../components";
import { TeamLayout } from "../../../layouts";
import { trpc } from "../../../lib/trpc";
import { NextAuthPage } from "../../../lib/types";

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
