import { Card, CardProps } from "@/components/card";

export default {
  title: "Components/Card",
  component: Card,
  args: {
    children: "Card",
  },
};

export const Default = (args: CardProps) => <Card {...args} />;

export const IsLoading = (args: CardProps) => <Card {...args} />;
IsLoading.args = {
  isLoading: true,
};
