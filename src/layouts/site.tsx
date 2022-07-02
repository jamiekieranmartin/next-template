import { PropsWithChildren } from "react";
import { useRouter } from "next/router";

import { Button, Link } from "../components";
import { useAuth } from "../hooks";

export type SiteLayoutProps = {};

export const SiteLayout: React.FC<PropsWithChildren<SiteLayoutProps>> = ({
  children,
}) => {
  const router = useRouter();
  const { session, signIn, signOut } = useAuth();

  return (
    <>
      <nav className="max-w-screen-lg mx-auto p-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <div className="text-lg font-medium border rounded-full w-12 h-12" />
          </Link>
        </div>

        {session.status === "unauthenticated" && (
          <Button size="sm" onClick={signIn}>
            Sign in
          </Button>
        )}

        {session.status === "authenticated" && (
          <div className="flex flex-row items-center gap-4">
            <Button size="sm" onClick={() => router.push("/teams")}>
              Go to dashboard
            </Button>
            <Button size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        )}
      </nav>

      <main className="max-w-prose mx-auto p-4 grid gap-8">{children}</main>
    </>
  );
};
