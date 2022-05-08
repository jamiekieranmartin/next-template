import { Layout, Link } from ".";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

export type TeamLayoutProps = {};

export const TeamLayout: React.FC<PropsWithChildren<TeamLayoutProps>> = ({
  children,
}) => {
  const router = useRouter();
  const slug = String(router.query.slug);

  return (
    <Layout>
      <div className="flex items-center gap-8">
        <Link href={`/u/${slug}`}>Dashboard</Link>
        <Link href={`/u/${slug}/members`}>Members</Link>
        <Link href={`/u/${slug}/settings`}>Settings</Link>
      </div>

      {children}
    </Layout>
  );
};