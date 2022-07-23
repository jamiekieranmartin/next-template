import { Badge, BadgeProps } from "@/components/badge";

export default {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
};

export const Default = (args: BadgeProps) => (
  <div className="flex gap-4">
    {(
      [
        "success",
        "error",
        "warning",
        "info",
        "active",
        "past_due",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "canceled",
      ] as BadgeProps["status"][]
    ).map((status, i) => (
      <Badge key={i} {...args} status={status}>
        {status}
      </Badge>
    ))}
  </div>
);
