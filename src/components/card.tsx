import React from "react";
import clsx from "clsx";

import { Spinner } from "./spinner";

export type CardProps = React.PropsWithChildren & {
  className?: string;
  isLoading?: boolean;
};

export const Card: React.FC<CardProps> = ({
  className,
  isLoading,
  children,
}) => {
  return (
    <div
      className={clsx(
        "rounded-lg border border-gray-300 px-4 md:px-6 py-6",
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </div>
  );
};
