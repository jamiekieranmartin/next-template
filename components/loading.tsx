import { isError, UseQueryResult } from "react-query";

interface LoadingProps<T> {
  query: UseQueryResult<T>;
  children: (props: T | undefined) => JSX.Element;
}

export function Loading<T>(props: LoadingProps<T>) {
  const { children, query } = props;
  const { data, isLoading } = query;

  if (isLoading) return <>Loading...</>;
  if (!data) return <>Not found</>;

  return <>{children(data)}</>;
}
