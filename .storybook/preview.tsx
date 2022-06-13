import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { RouterContext } from "next/dist/shared/lib/router-context";

import "../src/styles/globals.css";

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
