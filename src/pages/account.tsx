import { Badge, Button, Card, List, Text } from "../components";
import { useCheckout } from "../hooks";
import { AppLayout } from "../layouts";
import dayjs from "../utils/dayjs";
import { NextLayoutPage } from "../utils/types";
import { formatAmount } from "../utils/utils";

const Page: NextLayoutPage = () => {
  const { products, checkout, subscription, portal } = useCheckout();

  return (
    <Card isLoading={subscription.isLoading}>
      <Text>
        <h2 className="flex items-center gap-2">
          Subscription{" "}
          {!!subscription.data && (
            <Badge status={subscription.data?.status}>
              {subscription.data?.status?.replace("_", " ")}
            </Badge>
          )}
        </h2>
        {!!subscription.data ? (
          <p>
            Your subscription will renew on{" "}
            {dayjs(subscription.data.current_period_end).format("LL")}
          </p>
        ) : (
          <p>You have no active subscription</p>
        )}
      </Text>

      {!!subscription.data && (
        <Button disabled={portal.isLoading} onClick={() => portal.mutate()}>
          Manage Subscription
        </Button>
      )}

      {(!subscription.data ||
        ["canceled"].includes(subscription.data.status)) && (
        <>
          <Text>
            <h3>Plans</h3>
          </Text>
          <List
            isLoading={products.isLoading}
            data={products.data}
            columns={[
              {
                className: "ml-4 flex items-center font-medium text-gray-900",
                render: ({ name, description }) => (
                  <div className="flex flex-col justify-center">
                    <div className="flex-1">{name}</div>
                    <small className="font-normal text-xs text-gray-400">
                      {description}
                    </small>
                  </div>
                ),
              },
              {
                className: "ml-4 flex items-center font-medium text-gray-900",
                render: ({ prices }) => (
                  <div className="flex gap-2 items-center">
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
        </>
      )}
    </Card>
  );
};

Page.auth = true;
Page.Layout = AppLayout;

export default Page;
