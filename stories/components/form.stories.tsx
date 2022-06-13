import { Button, Input } from "../../src/components";
import { Form, FormProps } from "../../src/components/form";

export default {
  title: "Components/Form",
  component: Form,
  args: {
    children: (
      <>
        <Input>Input</Input>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};

export const Default = (args: FormProps) => <Form {...args} />;
