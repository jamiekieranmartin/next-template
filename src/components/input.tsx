import React from "react";
import clsx from "clsx";
import dayjs from "dayjs";

export interface InputProps extends React.ComponentPropsWithRef<"input"> {
  error?: React.ReactNode;
  description?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { children, className, description, error, ...rest } = props;

    return (
      <div>
        <label
          htmlFor={rest.id}
          className="p-1 block font-medium text-gray-700"
        >
          {children}
          {rest.required && "*"}
        </label>
        <div className="mt-1 relative grid">
          <input
            ref={ref}
            className={clsx(
              "placeholder:text-opacity-20 w-full focus:ring block px-3 py-1.5 border border-gray-300 rounded",
              {
                "border-red-400": error,
              },
              className
            )}
            {...rest}
            value={
              rest.type === "datetime-local" && rest.value
                ? dayjs(rest.value as unknown as Date)
                    .utc(true)
                    .toISOString()
                    .substring(0, 16)
                : rest.value
            }
          />
          {!!description && (
            <small className="p-1 opacity-50">{description}</small>
          )}
          {!!error && <small className="text-red-400 p-1">{error}</small>}
        </div>
      </div>
    );
  }
);
