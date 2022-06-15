import { UseQueryResult } from "react-query";

import { Spinner } from "./spinner";

interface LoadingProps<T> {
  query: UseQueryResult<T>;
  children: (props: T | undefined) => JSX.Element;
}

export function Loading<T>(props: LoadingProps<T>) {
  const { children, query } = props;
  const { data, isLoading } = query;

  if (isLoading) return <Spinner />;

  return <>{children(data)}</>;
}
