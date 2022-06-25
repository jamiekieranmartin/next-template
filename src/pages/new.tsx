import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, Form, Input, Text } from "../components";
import { AppLayout } from "../layouts";
import { CreateTeamInputType, createTeamSchema } from "../lib/schemas";
import { trpc } from "../lib/trpc";
import { NextLayoutPage } from "../lib/types";
import { slugify } from "../lib/utils";

const Page: NextLayoutPage = () => {
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState } =
    useForm<CreateTeamInputType>({
      resolver: zodResolver(createTeamSchema),
    });

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.create"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.list"]);
      router.push(`/teams/${slug}`);
    },
  });

  const { slug, name } = watch();

  useEffect(() => {
    if (name) {
      setValue("slug", slugify(name));
    }
  }, [name, setValue]);

  return (
    <Card isLoading={mutation.isLoading}>
      <Form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Text>
          <h2>Create a new team</h2>
        </Text>

        <Input
          type="text"
          required
          placeholder="My Team"
          error={formState.errors.name?.message}
          {...register("name")}
        >
          Team Name
        </Input>

        <Input
          type="text"
          required
          placeholder="my-team"
          description={`*.vercel.app/team/${slug || "my-team"}`}
          error={formState.errors.slug?.message}
          {...register("slug")}
        >
          Team Slug
        </Input>

        <Button type="submit">Submit</Button>
      </Form>
    </Card>
  );
};

Page.auth = true;
Page.Layout = AppLayout;

export default Page;
