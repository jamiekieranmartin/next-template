import { NextAuthPage } from "../../../lib/types";
import { trpc } from "../../../lib/trpc";
import { Button, Form, Input, Loading, TeamLayout } from "../../../components";
import { useRouter } from "next/router";
import * as Alert from "@radix-ui/react-alert-dialog";
import { slugify } from "../../../lib/utils";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { Team } from "@prisma/client";
import { team_edit } from "../../../lib/schema";

const TeamForm = ({ team }: { team: Team }) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      id: team.id,
      slug: team.slug,
      name: team.name,
    },
    schema: zodResolver(team_edit),
  });

  const utils = trpc.useContext();

  const mutation = trpc.useMutation(["team.edit"], {
    onSuccess(input) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          slug: input.slug,
        },
      });
    },
  });

  useEffect(() => {
    form.setFieldValue("slug", team.slug);
    form.setFieldValue("name", team.name);
  }, [team.slug, team.name]);

  useEffect(() => {
    form.setFieldValue("slug", slugify(form.values.name));
  }, [form.values.name]);

  return (
    <Form
      isLoading={mutation.isLoading}
      onSubmit={form.onSubmit((values) => mutation.mutate(values))}
    >
      <h2 className="col-span-2">Team Details</h2>

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

const List = ({
  team,
}: {
  team: Team & {
    stripe_account: {
      default_currency: string;
      charges_enabled: boolean;
      payouts_enabled: boolean;
    } | null;
  };
}) => {
  const router = useRouter();

  const member = trpc.useQuery(["team.member.role", { team_id: team.id }]);
  const mutation = trpc.useMutation(["team.delete"], {
    onSuccess() {
      router.push("/");
    },
  });

  const account = trpc.useMutation(["team.connect"], {
    onSuccess({ url }) {
      router.push(url);
    },
  });

  if (!member.data) return <>Loading...</>;
  if (member.data.role !== "OWNER") return null;

  return (
    <>
      <h4>
        Default Currency: {team.stripe_account?.default_currency.toUpperCase()}
      </h4>
      <h4>
        Charges: {team.stripe_account?.charges_enabled ? "Enabled" : "Disabled"}
      </h4>
      <h4>
        Payouts: {team.stripe_account?.payouts_enabled ? "Enabled" : "Disabled"}
      </h4>

      <Button onClick={() => account.mutate({ id: team.id })}>
        {team.stripe_account ? "Edit Stripe Account" : "Connect Stripe Account"}
      </Button>

      <Alert.Root>
        <Alert.Trigger asChild>
          <Button danger>Delete</Button>
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
                <Button>Cancel</Button>
              </Alert.Cancel>
              <Alert.Action asChild>
                <Button danger onClick={() => mutation.mutate({ id: team.id })}>
                  Yes, delete team
                </Button>
              </Alert.Action>
            </div>
          </Alert.Content>
        </Alert.Portal>
      </Alert.Root>
    </>
  );
};

const Page: NextAuthPage = () => {
  const router = useRouter();
  const slug = String(router.query.slug);

  const team = trpc.useQuery(["team.get", { slug }]);
  if (team.error) {
    router.push("/");
  }

  return (
    <Loading query={team}>
      {(team) => (
        <>
          <TeamForm team={team} />
          <List team={team} />
        </>
      )}
    </Loading>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
