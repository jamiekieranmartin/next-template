import { Select, SelectProps } from "../../src/components/select";

export default {
  title: "Components/Select",
  component: Select,
  args: {
    options: [
      { name: "A", value: "a" },
      { name: "B", value: "b" },
      { name: "C", value: "c" },
    ],
    children: "Select",
  },
};

export const Default = (args: SelectProps) => <Select {...args} />;

export const WithDescription = (args: SelectProps) => <Select {...args} />;
WithDescription.args = {
  description: "This is the description",
};

export const WithError = (args: SelectProps) => <Select {...args} />;
WithError.args = {
  error: "This is the error",
};
