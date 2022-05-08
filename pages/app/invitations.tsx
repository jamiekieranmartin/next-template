import { trpc } from "../../lib/trpc";
import { NextAuthPage } from "../../lib/types";
import { Button, Layout, Loading } from "../../components";

const Page: NextAuthPage = () => {
  const invitations = trpc.useQuery(["user.invitations"]);

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["user.accept"], {
    async onSuccess() {
      utils.invalidateQueries(["user.invitations"]);
      utils.invalidateQueries(["team.list"]);
    },
  });

  return (
    <>
      <h2 className="text-xl font-bold">Invitations</h2>
      <Loading query={invitations}>
        {(invitations) => (
          <div className="divide-y divide-gray-200">
            {invitations && invitations.length ? (
              invitations.map(({ team_id, team }, i) => (
                <div key={i} className="flex justify-between">
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {team.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex justify-end">
                    <Button onClick={() => mutation.mutate({ team_id })}>
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <small>No invitations</small>
            )}
          </div>
        )}
      </Loading>
    </>
  );
};

Page.auth = true;
Page.Layout = Layout;

export default Page;
