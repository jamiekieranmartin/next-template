import { Link, LinkProps } from "@/components/link";

export default {
  title: "Components/Link",
  component: Link,
  args: {
    href: "/",
    children: "Link",
  },
};

export const Default = (args: LinkProps) => <Link {...args} />;
