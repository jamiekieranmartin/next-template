import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

export const setupLogRocket = () => {
  // only initialize when in the browser
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_ID!);
    // plugins should also only be initialized when in the browser
    setupLogRocketReact(LogRocket);
  }
};
