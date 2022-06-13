import React from "react";

import clsx from "clsx";

export interface SelectProps extends React.ComponentPropsWithRef<"select"> {
  options: {
    name: string;
    value: any;
  }[];
  error?: React.ReactNode;
  description?: string;
}

// eslint-disable-next-line react/display-name
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const { children, className, options, description, error, ...rest } = props;
    return (
      <div className={className}>
        <label
          htmlFor={rest.id}
          className="p-1 block font-medium text-gray-700"
        >
          {children}
        </label>
        <div className="mt-1 relative">
          <select
            ref={ref}
            className={clsx(
              "w-full focus:ring block border-gray-300 py-1.5 px-3 rounded border",
              {
                "border-red-400": error,
              },
              className
            )}
            {...rest}
          >
            {options?.map(({ name, value }, i) => (
              <option key={i} value={value}>
                {name}
              </option>
            ))}
          </select>
          {description && (
            <small className="p-1 opacity-50">{description}</small>
          )}
          {error && <small className="text-red-400 p-1">{error}</small>}
        </div>
      </div>
    );
  }
);
