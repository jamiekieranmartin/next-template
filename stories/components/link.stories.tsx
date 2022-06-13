import { Link, LinkProps } from "../../src/components/link";

export default {
  title: "Components/Link",
  component: Link,
  args: {
    children: "Link",
  },
};

export const Default = (args: LinkProps) => <Link {...args} />;
