import clsx from "clsx";
import React from "react";

export type PreviewProps = React.ComponentPropsWithoutRef<"pre">;

export const Preview: React.FC<PreviewProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <pre className={clsx("overflow-x-auto", className)} {...rest}>
      {children}
    </pre>
  );
};
