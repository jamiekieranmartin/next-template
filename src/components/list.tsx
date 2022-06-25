import React from "react";
import clsx from "clsx";

import { Spinner } from "./spinner";

export type ListProps<T = object> = {
  data?: T[];
  columns: {
    className?: string;
    // eslint-disable-next-line no-unused-vars
    render: (item: T) => React.ReactNode;
  }[];
  isLoading?: boolean;
  emptyLabel?: string;
};

export function List<T = object>(props: ListProps<T>) {
  const { data = [], columns = [], isLoading, emptyLabel = "No items" } = props;

  if (isLoading) return <Spinner />;

  return (
    <div className="divide-y divide-gray-200">
      {!!data &&
        data.map((row, i) => (
          <div key={i} className="flex justify-between">
            {columns.map(({ className, render }, i) => (
              <div
                key={i}
                className={clsx("px-6 py-4 whitespace-nowrap", className)}
              >
                {render(row)}
              </div>
            ))}
          </div>
        ))}

      {!data?.length && (
        <small className="block text-center">{emptyLabel}</small>
      )}
    </div>
  );
}
