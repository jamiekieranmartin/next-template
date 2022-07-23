import { Button, Card, List, Text } from "@/components";
import { AppLayout } from "@/layouts";
import { trpc } from "@/utils/trpc";
import { NextLayoutPage } from "@/utils/types";

const Page: NextLayoutPage = () => {
  const invitations = trpc.useQuery(["user.invitations"]);

  const utils = trpc.useContext();
  const accept = trpc.useMutation(["user.accept"], {
    async onSuccess() {
      await utils.invalidateQueries(["user.invitations"]);
      await utils.invalidateQueries(["team.list"]);
    },
  });

  return (
    <Card isLoading={invitations.isLoading}>
      <Text>
        <h2>Invitations</h2>
      </Text>

      <List
        data={invitations.data}
        columns={[
          {
            className: "ml-4 flex items-center font-medium text-gray-900",
            render: ({ team }) => team.name,
          },
          {
            render: ({ team_id }) => (
              <Button onClick={() => accept.mutate({ team_id })}>Accept</Button>
            ),
          },
        ]}
        emptyLabel="You have no pending invitations."
      />
    </Card>
  );
};

Page.auth = true;
Page.Layout = AppLayout;

export default Page;
