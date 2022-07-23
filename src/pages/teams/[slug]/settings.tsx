import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button, Card, Form, Input, Text } from "@/components";
import { TeamLayout } from "@/layouts";
import { EditTeamInputType, editTeamSchema } from "@/utils/schemas";
import { trpc } from "@/utils/trpc";
import { NextLayoutPage } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Alert from "@radix-ui/react-alert-dialog";

const TeamForm: React.FC = () => {
  const router = useRouter();

  const team = trpc.useQuery(["team.get", { slug: String(router.query.slug) }]);
  if (team.isError) {
    router.push("/");
  }

  const { register, handleSubmit, watch, setValue, formState } =
    useForm<EditTeamInputType>({
      resolver: zodResolver(editTeamSchema),
      defaultValues: {
        id: "",
        slug: "",
        name: "",
      },
    });

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.edit"], {
    async onSuccess({ slug }) {
      await utils.invalidateQueries(["team.list"]);
      await utils.invalidateQueries(["team.get", { slug }]);
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          slug,
        },
      });
    },
  });

  useEffect(() => {
    if (team.data?.id) {
      setValue("id", team.data.id);
    }
    if (team.data?.name) {
      setValue("slug", team.data.slug);
    }
    if (team.data?.slug) {
      setValue("name", team.data.name);
    }
  }, [team.data, setValue]);

  const { slug, name } = watch();

  return (
    <Card>
      <Text>
        <h2>Update team details ✏️</h2>
      </Text>

      <Form
        isLoading={mutation.isLoading}
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
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

        <Button
          type="submit"
          disabled={team.data?.slug === slug && team.data?.name === name}
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
};

const TeamSettings: React.FC = () => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");

  const utils = trpc.useContext();
  const remove = trpc.useMutation(["team.delete"], {
    async onSuccess({ slug }) {
      await utils.invalidateQueries(["team.list"]);
      await utils.invalidateQueries(["team.get", { slug }]);
      router.push("/");
    },
  });

  return (
    <Card>
      <Text>
        <h2>🚨 The danger zone 🚨</h2>
      </Text>

      <Alert.Root>
        <Alert.Trigger asChild>
          <Button danger>Delete team</Button>
        </Alert.Trigger>

        <Alert.Portal>
          <Alert.Overlay className="fixed bg-black/20 inset-0" />
          <Alert.Content className="bg-white rounded fixed max-w-prose top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 focus:outline-none grid gap-4">
            <Alert.Title className="mb-2 font-medium">
              Are you absolutely sure?
            </Alert.Title>
            <Alert.Description>
              This action cannot be undone. This will permanently delete your
              team and remove your data from our servers.
            </Alert.Description>
            <div className="flex items-end gap-4">
              <Alert.Cancel asChild>
                <Button>No, take me back</Button>
              </Alert.Cancel>
              <Alert.Action asChild>
                <Button danger onClick={() => remove.mutate({ slug })}>
                  Yes, delete team
                </Button>
              </Alert.Action>
            </div>
          </Alert.Content>
        </Alert.Portal>
      </Alert.Root>
    </Card>
  );
};

const Page: NextLayoutPage = () => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");
  const role = trpc.useQuery(["team.member.role", { slug }]);

  return (
    <>
      <TeamForm />

      {role.data?.role === "owner" ? <TeamSettings /> : null}
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
