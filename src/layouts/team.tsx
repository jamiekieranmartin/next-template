import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";

import { Link } from "@/components";

import { AppLayout } from "./app";

export type TeamLayoutProps = {};

export const TeamLayout: React.FC<PropsWithChildren<TeamLayoutProps>> = ({
  children,
}) => {
  const router = useRouter();
  const slug = String(router.query.slug);

  return (
    <AppLayout>
      <div className="flex items-center gap-8">
        <Link href={`/teams/${slug}`}>Dashboard</Link>
        <Link href={`/teams/${slug}/members`}>Members</Link>
        <Link href={`/teams/${slug}/settings`}>Settings</Link>
      </div>

      {children}
    </AppLayout>
  );
};
