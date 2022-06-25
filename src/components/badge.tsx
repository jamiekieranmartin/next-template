import React from "react";
import clsx from "clsx";
import Stripe from "stripe";

export type BadgeProps = React.PropsWithChildren & {
  status?:
    | "success"
    | "error"
    | "warning"
    | "info"
    | Stripe.Subscription.Status;

  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({
  status = "",
  className,
  children,
}) => {
  return (
    <span
      className={clsx(
        "rounded-2xl border font-semibold px-2 py-0.5 text-sm w-fit flex items-center gap-2",
        {
          "text-green-500": ["success", "active", "trialing"].includes(status),
          "text-red-500": ["error", "past_due", "unpaid"].includes(status),
          "text-yellow-500": ["warning", "incomplete"].includes(status),
          "text-blue-500": ["info"].includes(status),
          "text-gray-500": ["", "incomplete_expired", "canceled"].includes(
            status
          ),
        },
        className
      )}
    >
      <div
        className={clsx("h-2.5 w-2.5 rounded-full", {
          "bg-green-500": ["success", "active", "trialing"].includes(status),
          "bg-red-500": ["error", "past_due", "unpaid"].includes(status),
          "bg-yellow-500": ["warning", "incomplete"].includes(status),
          "bg-blue-500": ["info"].includes(status),
          "bg-gray-500": ["", "incomplete_expired", "canceled"].includes(
            status
          ),
        })}
      ></div>
      {children}
    </span>
  );
};
