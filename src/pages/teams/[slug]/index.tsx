import { useRouter } from "next/router";

import { Card, Preview, Text } from "@/components";
import { TeamLayout } from "@/layouts";
import { trpc } from "@/utils/trpc";
import { NextLayoutPage } from "@/utils/types";

const Page: NextLayoutPage = () => {
  const router = useRouter();
  const slug = String(router.query.slug);

  const team = trpc.useQuery(["team.get", { slug }]);
  if (team.isError) {
    router.push("/");
  }

  return (
    <Card isLoading={team.isLoading}>
      <Text>
        <h2>{team.data?.name}</h2>
      </Text>

      <Preview>{JSON.stringify(team.data, undefined, 2)}</Preview>
    </Card>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
