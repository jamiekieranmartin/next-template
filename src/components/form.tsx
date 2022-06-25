import React from "react";
import clsx from "clsx";

import { Spinner } from "./spinner";

export interface FormProps extends React.ComponentPropsWithRef<"form"> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (props, ref) => {
    const { children, className, isLoading, ...rest } = props;

    return (
      <form ref={ref} className={clsx("grid gap-4", className)} {...rest}>
        {isLoading ? <Spinner /> : children}
      </form>
    );
  }
);
