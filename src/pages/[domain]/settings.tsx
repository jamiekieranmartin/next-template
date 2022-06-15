import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import * as Alert from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button, Form, Input, Loading, Spinner } from "../../components";
import { TeamLayout } from "../../layouts";
import { EditTeamInputType, editTeamSchema } from "../../lib/schemas";
import { trpc } from "../../lib/trpc";
import { NextAuthPage } from "../../lib/types";
import { domainify } from "../../lib/utils";

type TeamFormProps = {
  team: Team;
};

const TeamForm: React.FC<TeamFormProps> = ({ team }) => {
  const router = useRouter();

  const { register, handleSubmit, watch, setValue } =
    useForm<EditTeamInputType>({
      resolver: zodResolver(editTeamSchema),
      defaultValues: {
        id: team.id,
        domain: team.domain,
        name: team.name,
      },
    });

  const mutation = trpc.useMutation(["team.edit"], {
    onSuccess(input) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          domain: input.domain,
        },
      });
    },
  });

  useEffect(() => {
    setValue("domain", team.domain);
    setValue("name", team.name);
  }, [team.domain, team.name, setValue]);

  const { domain, name } = watch();

  useEffect(() => {
    setValue("domain", domainify(name));
  }, [name, setValue]);

  return (
    <Form
      isLoading={mutation.isLoading}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <h2 className="text-xl font-bold col-span-2">Team Details</h2>

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

type ListProps = {
  team: Team & {
    stripe_account: {
      default_currency: string;
      charges_enabled: boolean;
      payouts_enabled: boolean;
    } | null;
  };
};

const List: React.FC<ListProps> = ({ team }) => {
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

  if (!member.data) return <Spinner />;
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
  const domain = String(router.query.domain);

  const team = trpc.useQuery(["team.get", { domain }]);
  if (team.error) {
    router.push("/");
  }

  return (
    <Loading query={team}>
      {(team) => (
        <>
          <TeamForm team={team!} />
          <List team={team!} />
        </>
      )}
    </Loading>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
