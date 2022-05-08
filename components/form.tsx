import clsx from "clsx";
import React from "react";

export interface FormProps extends React.ComponentPropsWithRef<"form"> {
  isLoading?: boolean;
  children: React.ReactNode;
}

// eslint-disable-next-line react/display-name
export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (props, ref) => {
    const { children, className, isLoading, ...rest } = props;

    return (
      <form ref={ref} className={clsx("grid gap-4", className)} {...rest}>
        {isLoading ? "Loading..." : children}
      </form>
    );
  }
);
