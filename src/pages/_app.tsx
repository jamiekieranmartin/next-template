import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import transformer from "superjson";

import { TRPCClientErrorLike } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { Maybe } from "@trpc/server";

import { SEO } from "../components";
import type { AppRouter } from "../server/routers/_app";
import { setupLogRocket } from "../utils/logrocket";
import { NextLayoutPage } from "../utils/types";

import "../styles/globals.css";

setupLogRocket();

type AppPropsWithAuth = AppProps & {
  Component: NextLayoutPage;
};

const App = ({ Component, pageProps }: AppPropsWithAuth) => {
  const Layout =
    Component.Layout || ((props: any) => <React.Fragment {...props} />);

  return (
    <SessionProvider>
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
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: (failureCount, _err) => {
              const err = _err as never as Maybe<
                TRPCClientErrorLike<AppRouter>
              >;
              const code = err?.data?.code;
              if (
                code === "BAD_REQUEST" ||
                code === "FORBIDDEN" ||
                code === "UNAUTHORIZED"
              ) {
                // if input data is wrong or you're not authorized there's no point retrying a query
                return false;
              }
              const MAX_QUERY_RETRIES = 3;
              return failureCount < MAX_QUERY_RETRIES;
            },
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);
