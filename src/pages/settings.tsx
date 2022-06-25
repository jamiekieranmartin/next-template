import { Badge, Button, Card, List, Text } from "../components";
import { AppLayout } from "../layouts";
import dayjs from "../lib/dayjs";
import { useCheckout } from "../lib/hooks";
import { NextLayoutPage } from "../lib/types";
import { formatAmount } from "../lib/utils";

const Page: NextLayoutPage = () => {
  const { products, checkout, subscription, portal } = useCheckout();

  return (
    <Card isLoading={subscription.isLoading}>
      <Text>
        <h2 className="flex items-center gap-2">
          Subscription{" "}
          <Badge status={subscription.data?.status}>
            {subscription.data?.status?.replace("_", " ")}
          </Badge>
        </h2>
        <p>
          {subscription.data
            ? `Your subscription will renew on ${dayjs(
                subscription.data.current_period_end
              ).format("LL")}`
            : "You have no active subscription"}
        </p>
      </Text>

      {!!subscription.data && (
        <Button disabled={portal.isLoading} onClick={() => portal.mutate()}>
          Manage Subscription
        </Button>
      )}

      {!subscription.data ||
        (["canceled"].includes(subscription.data.status) && (
          <List
            isLoading={products.isLoading}
            data={products.data}
            columns={[
              {
                className: "ml-4 flex items-center font-medium text-gray-900",
                render: ({ name }) => (
                  <div className="flex items-center">
                    <div className="flex-1">{name}</div>
                  </div>
                ),
              },
              {
                className: "ml-4 flex items-center font-medium text-gray-900",
                render: ({ prices }) => (
                  <div className="flex items-center">
                    {prices.map(({ id, unit_amount, recurring_interval }) => (
                      <Button
                        key={id}
                        size="sm"
                        onClick={() =>
                          checkout.mutate({
                            price_id: id,
                          })
                        }
                      >
                        {formatAmount(unit_amount)} / {recurring_interval}
                      </Button>
                    ))}
                  </div>
                ),
              },
            ]}
            emptyLabel="No products available."
          />
        ))}
    </Card>
  );
};

Page.auth = true;
Page.Layout = AppLayout;

export default Page;
