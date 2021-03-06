import { Card } from "@/components";
import { Preview, PreviewProps } from "@/components/preview";

export default {
  title: "Components/Preview",
  component: Preview,
  args: {
    children: JSON.stringify({ a: "A", b: "B", c: "C" }, null, 2),
  },
};

export const Default = (args: PreviewProps) => <Preview {...args} />;

export const InACard = (args: PreviewProps) => (
  <Card>
    <Preview {...args} />
  </Card>
);
