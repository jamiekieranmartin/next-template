import { Button, Input } from "../../components";
import { Form, FormProps } from "../../components/form";

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
