import React from "react";
import clsx from "clsx";

export type TextProps = React.PropsWithChildren & {
  className?: string;
};

export const Text: React.FC<TextProps> = ({ children, className }) => {
  return <div className={clsx("prose mb-4", className)}>{children}</div>;
};
