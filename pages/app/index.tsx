import { NextAuthPage } from "../../lib/types";
import { trpc } from "../../lib/trpc";
import { Button, Link, Layout, Loading } from "../../components";
import { useState, useEffect } from "react";

const Page: NextAuthPage = () => {
  const teams = trpc.useQuery(["team.list"]);
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.href);
    }
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold">Teams</h2>

      <Loading query={teams}>
        {(teams) => (
          <div className="divide-y divide-gray-200">
            {teams && teams.length ? (
              teams.map(({ domain, name }, i) => (
                <div key={i} className="flex justify-between">
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link
                        href={`/${domain}`}
                        className="font-medium text-gray-900"
                      >
                        {name}
                      </Link>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-end gap-4">
                    <Button>
                      <Link href={`/${domain}`}>Manage</Link>
                    </Button>
                    <Button>
                      <Link href={host.replace("app", domain)}>View</Link>
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
