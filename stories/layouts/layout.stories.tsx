import { Layout, LayoutProps } from "../../src/layouts/layout";

export default {
  title: "Layouts/Layout",
  component: Layout,
  args: {
    children: "Layout",
  },
};

export const Default = (args: LayoutProps) => <Layout {...args} />;
