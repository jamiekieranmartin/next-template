import { Card, Preview, Text } from "../../../components";
import { TeamLayout } from "../../../layouts";
import { useTeam } from "../../../lib/hooks";
import { NextLayoutPage } from "../../../lib/types";

const Page: NextLayoutPage = () => {
  const team = useTeam();

  return (
    <Card isLoading={team?.isLoading}>
      <Text>
        <h2>{team?.data?.name}</h2>
      </Text>

      <Preview>{JSON.stringify(team?.data, undefined, 2)}</Preview>
    </Card>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
