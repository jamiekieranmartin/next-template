import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import * as C from "@radix-ui/react-checkbox";
import clsx from "clsx";

export interface CheckboxProps extends React.ComponentPropsWithRef<"button"> {
  error?: React.ReactNode;
  description?: string;
  onChange: any;
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { children, className, description, error, ...rest } = props;

  return (
    <div className={clsx("mt-1 relative grid", className)}>
      <div className="flex items-center justify-start gap-4">
        <C.Root
          className={clsx(
            "bg-transparent focus:ring px-3 py-1.5 h-7 w-7 border border-gray-300 rounded flex items-center justify-center",
            {
              "border-red-400": error,
            }
          )}
          {...rest}
          onCheckedChange={rest.onChange}
        >
          <C.Indicator>
            <CheckIcon />
          </C.Indicator>
        </C.Root>
        <label
          htmlFor={rest.id}
          className="p-1 block font-medium text-gray-700"
        >
          {children}
        </label>
      </div>

      {description && <small className="p-1 opacity-50">{description}</small>}
      {error && <small className="text-red-400 p-1">{error}</small>}
    </div>
  );
};
