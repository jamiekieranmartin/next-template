import { Checkbox, CheckboxProps } from "../../src/components/checkbox";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    children: "Checkbox",
  },
};

export const Default = (args: CheckboxProps) => <Checkbox {...args} />;

export const WithDescription = (args: CheckboxProps) => <Checkbox {...args} />;
WithDescription.args = {
  description: "This is the description",
};

export const WithError = (args: CheckboxProps) => <Checkbox {...args} />;
WithError.args = {
  error: "This is the error",
};
