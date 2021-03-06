import { Button, Card, Link, List, Text } from "@/components";
import { AppLayout } from "@/layouts";
import { trpc } from "@/utils/trpc";
import { NextLayoutPage } from "@/utils/types";

const Page: NextLayoutPage = () => {
  const teams = trpc.useQuery(["team.list"]);

  return (
    <Card isLoading={teams.isLoading}>
      <Text>
        <h2>Your teams 👏</h2>
      </Text>

      <List
        data={teams.data}
        columns={[
          {
            className: "ml-4 flex items-center font-medium text-gray-900",
            render: ({ name, slug }) => (
              <Link
                href={`/teams/${slug}`}
                className="font-medium text-gray-900"
              >
                {name}
              </Link>
            ),
          },
          {
            render: ({ slug }) => (
              <Button>
                <Link href={`/teams/${slug}`}>Manage</Link>
              </Button>
            ),
          },
        ]}
        emptyLabel="You are not a member of any teams."
      />
    </Card>
  );
};

Page.auth = true;
Page.Layout = AppLayout;

export default Page;
