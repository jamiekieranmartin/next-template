import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../src/utils/trpc";

import "../src/styles/globals.css";
import { Session } from "next-auth";

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => {
    const session: Session = {
      user: {
        name: "",
        email: "",
        image: "",
      },
      expires: "",
    };

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
      trpc.createClient({
        url: "http://localhost:3000/api/trpc",

        // optional
        headers() {
          return {};
        },
      })
    );

    return (
      <SessionProvider session={session}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </trpc.Provider>
      </SessionProvider>
    );
  },
];
