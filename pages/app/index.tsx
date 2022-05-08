import { NextAuthPage } from "../../lib/types";
import { trpc } from "../../lib/trpc";
import { Button, Link, Layout, Loading } from "../../components";

const Page: NextAuthPage = () => {
  const teams = trpc.useQuery(["team.list"]);

  return (
    <>
      <h2 className="font-medium">Teams</h2>

      <Loading query={teams}>
        {(teams) => (
          <div className="divide-y divide-gray-200">
            {teams && teams.length ? (
              teams.map(({ slug, name }, i) => (
                <div key={i} className="flex justify-between">
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link
                        href={`/${slug}`}
                        className="font-medium text-gray-900"
                      >
                        {name}
                      </Link>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-end">
                    <Button>
                      <Link href={`/${slug}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <small>No teams</small>
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
