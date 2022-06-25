import { Button, Card, Input } from "../../src/components";
import { Form, FormProps } from "../../src/components/form";

export default {
  title: "Components/Form",
  component: Form,
  args: {
    children: (
      <>
        <Input>Input</Input>
        <Button type="button">Submit</Button>
      </>
    ),
  },
};

export const Default = (args: FormProps) => <Form {...args} />;

export const IsLoading = (args: FormProps) => <Form {...args} />;
IsLoading.args = {
  isLoading: true,
};

export const InACard = (args: FormProps) => (
  <Card>
    <Form {...args} />
  </Card>
);
