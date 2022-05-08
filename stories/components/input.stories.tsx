import { Input, InputProps } from "../../components/input";

export default {
  title: "Components/Input",
  component: Input,
  args: {
    children: "Input",
  },
};

export const Default = (args: InputProps) => <Input {...args} />;

export const WithDescription = (args: InputProps) => <Input {...args} />;
WithDescription.args = {
  description: "This is the description",
};

export const WithError = (args: InputProps) => <Input {...args} />;
WithError.args = {
  error: "This is the error",
};
