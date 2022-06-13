import React from "react";

import clsx from "clsx";

export type PreviewProps = React.ComponentPropsWithoutRef<"pre">;

export const Preview: React.FC<PreviewProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <pre className={clsx("overflow-x-auto", className)} {...rest}>
      {children}
    </pre>
  );
};
