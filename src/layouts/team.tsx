import React, { PropsWithChildren } from "react";

import { useRouter } from "next/router";

import { Link } from "../components";
import { Layout } from "./layout";

export type TeamLayoutProps = {};

export const TeamLayout: React.FC<PropsWithChildren<TeamLayoutProps>> = ({
  children,
}) => {
  const router = useRouter();
  const domain = String(router.query.domain);

  return (
    <Layout>
      <div className="flex items-center gap-8">
        <Link href={`/${domain}`}>Dashboard</Link>
        <Link href={`/${domain}/members`}>Members</Link>
        <Link href={`/${domain}/settings`}>Settings</Link>
      </div>

      {children}
    </Layout>
  );
};
