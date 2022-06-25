import { useRouter } from "next/router";

export const useSlug = () => {
  const router = useRouter();
  return String(router.query.slug ?? "");
};
