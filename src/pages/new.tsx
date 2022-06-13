import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button, Input, Form } from "../components";
import { Layout } from "../layouts";
import { CreateTeamInputType, createTeamSchema } from "../lib/schemas";
import { trpc } from "../lib/trpc";
import { NextAuthPage } from "../lib/types";
import { domainify } from "../lib/utils";

const Page: NextAuthPage = () => {
  const router = useRouter();

  const { register, handleSubmit, watch, setValue } =
    useForm<CreateTeamInputType>({
      resolver: zodResolver(createTeamSchema),
    });

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.create"], {
    onSuccess(input) {
      utils.invalidateQueries(["team.list"]);
      router.push(`/${input.domain}`);
    },
  });

  const { domain, name } = watch();

  useEffect(() => {
    if (name) {
      setValue("domain", domainify(name));
    }
  }, [name, setValue]);

  return (
    <Form
      isLoading={mutation.isLoading}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <h2 className="text-xl font-bold col-span-2">Create a new team</h2>

      <Input type="text" required placeholder="My Team" {...register("name")}>
        Team Name
      </Input>

      <Input
        type="text"
        required
        placeholder="my-team"
        description={`${domain || "my-team"}.jamiekieranmartin.app`}
        {...register("domain")}
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
