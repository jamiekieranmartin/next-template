import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { NextAuthPage } from "../lib/types";
import React, { useEffect } from "react";
import { SEO } from "../lib/seo";
import { AppRouter } from "../server/routers/_app";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { SSRContext, transformer } from "../lib/trpc";
import { withTRPC } from "@trpc/next";
import { TRPCError } from "@trpc/server";

type AppPropsWithAuth = AppProps & {
  Component: NextAuthPage;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
  const Layout =
    Component.Layout || ((props: any) => <React.Fragment {...props} />);

  return (
    <SessionProvider session={session}>
      <SEO />
      {Component.auth ? (
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
};

function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null;
}

const getBaseUrl = () => {
  if (process.browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: (failureCount: number, error: any) => {
              const trcpErrorCode = error?.data?.code as TRPCError["code"];
              if (
                trcpErrorCode === "NOT_FOUND" ||
                trcpErrorCode === "UNAUTHORIZED"
              )
                return false;
              if (failureCount < 3) return true;
              return false;
            },
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  // ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  // responseMeta(opts) {
  //   const ctx = opts.ctx as SSRContext;

  //   if (ctx.status) {
  //     // If HTTP status set, propagate that
  //     return {
  //       status: ctx.status,
  //     };
  //   }

  //   const error = opts.clientErrors[0];
  //   if (error) {
  //     // Propagate http first error from API calls
  //     return {
  //       status: error.data?.httpStatus ?? 500,
  //     };
  //   }
  //   // For app caching with SSR see https://trpc.io/docs/caching
  //   return {};
  // },
})(App);
