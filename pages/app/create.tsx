import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { slugify } from "../../lib/utils";
import { NextAuthPage } from "../../lib/types";
import { trpc } from "../../lib/trpc";
import { Button, Input, Layout, Form } from "../../components";
import { useRouter } from "next/router";
import { team_create } from "../../lib/schema";

const Page: NextAuthPage = () => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      slug: "",
      name: "",
    },
    schema: zodResolver(team_create),
  });

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.create"], {
    onSuccess(input) {
      utils.invalidateQueries(["team.list"]);
      router.push(`/${input.slug}`);
    },
  });

  useEffect(() => {
    form.setFieldValue("slug", slugify(form.values.name));
  }, [form.values.name]);

  return (
    <Form
      isLoading={mutation.isLoading}
      onSubmit={form.onSubmit((values) => mutation.mutate(values))}
    >
      <h2 className="col-span-2">Create a Team</h2>

      <Input
        type="text"
        required
        placeholder="My Team"
        onBlur={() => form.validateField("name")}
        {...form.getInputProps("name")}
      >
        Team Name
      </Input>

      <Input
        type="text"
        required
        placeholder="my-team"
        description={`www.domain.com/${form.values.slug || "my-team"}`}
        onBlur={() => form.validateField("slug")}
        {...form.getInputProps("slug")}
      >
        Team Slug
      </Input>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

Page.auth = true;
Page.Layout = Layout;

export default Page;
