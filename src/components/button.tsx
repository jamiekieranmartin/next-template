import React from "react";

import clsx from "clsx";

export const widths = {
  auto: "w-auto",
  full: "w-full",
  fit: "w-fit",
};

export const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
};

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  width?: keyof typeof widths;
  size?: keyof typeof sizes;
  danger?: boolean;
}

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      width = "fit",
      size = "md",
      danger,
      ...rest
    } = props;

    return (
      <button
        ref={ref}
        className={clsx(
          "font-medium text-gray-700 rounded border border-gray-300 flex items-center disabled:cursor-not-allowed disabled:opacity-25 hover:opacity-75 transform duration-300 ease-in-out",
          {
            [widths[width]]: true,
            [sizes[size]]: true,
            "bg-red-500 text-white": danger,
          },
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
