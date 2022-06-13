import { Button, ButtonProps } from "../../src/components/button";

export default {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export const Default = (args: ButtonProps) => <Button {...args} />;

export const WithDanger = (args: ButtonProps) => <Button {...args} />;
WithDanger.args = {
  danger: true,
};
