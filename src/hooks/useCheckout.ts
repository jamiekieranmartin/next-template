import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";

export const useCheckout = () => {
  const router = useRouter();

  const products = trpc.useQuery(["checkout.products"]);

  const subscription = trpc.useQuery(["checkout.subscription"]);

  const portal = trpc.useMutation(["checkout.portal"], {
    async onSuccess({ url }) {
      router.push(url);
    },
  });

  const checkout = trpc.useMutation(["checkout.create"], {
    async onSuccess({ url }) {
      if (url) router.push(url);
    },
  });

  return {
    products,
    checkout,

    subscription,
    portal,
  };
};
