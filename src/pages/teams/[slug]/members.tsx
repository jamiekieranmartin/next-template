import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Avatar, Button, Card, Form, Input, List, Text } from "@/components";
import { TeamLayout } from "@/layouts";
import {
  InviteTeamMemberInputType,
  inviteTeamMemberSchema,
} from "@/utils/schemas";
import { trpc } from "@/utils/trpc";
import { NextLayoutPage } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Alert from "@radix-ui/react-alert-dialog";

const TeamMemberForm: React.FC = () => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");

  const utils = trpc.useContext();
  const invite = trpc.useMutation(["team.member.invite"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.member.list", { slug }]);
      await utils.invalidateQueries(["team.member.invitations", { slug }]);
    },
  });

  const { register, handleSubmit, setValue, reset, formState } =
    useForm<InviteTeamMemberInputType>({
      resolver: zodResolver(inviteTeamMemberSchema),
    });

  useEffect(() => {
    setValue("slug", slug);
  }, [slug, setValue]);

  return (
    <Card>
      <Text>
        <h2>Invite a member 🧑</h2>
      </Text>

      <Form
        isLoading={invite.isLoading}
        onSubmit={handleSubmit((values) =>
          invite.mutate(values, {
            async onSuccess() {
              reset();
            },
          })
        )}
      >
        <Input
          type="text"
          required
          placeholder="me@*.vercel.app"
          error={formState.errors.email?.message}
          {...register("email")}
        >
          Email
        </Input>

        <div />

        <Button type="submit">Send invite</Button>
      </Form>
    </Card>
  );
};

const MembersList = () => {
  const session = useSession();

  const router = useRouter();
  const slug = String(router.query.slug ?? "");
  const role = trpc.useQuery(["team.member.role", { slug }]);
  const members = trpc.useQuery(["team.member.list", { slug }]);

  const utils = trpc.useContext();
  const remove = trpc.useMutation(["team.member.remove"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.member.list", { slug }]);
      await utils.invalidateQueries(["team.member.invitations", { slug }]);
    },
  });

  return (
    <Card>
      <Text>
        <h2>Members ❤️</h2>
      </Text>

      <List
        isLoading={members.isLoading}
        data={members.data}
        columns={[
          {
            render: ({ user }) => (
              <div className="flex items-center">
                <Avatar src={user.image} name={user.name} />
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </div>
              </div>
            ),
          },
          {
            render: ({ user_id }) => {
              const hide =
                role.data?.role !== "owner" ||
                user_id === session.data?.user?.id;

              if (hide) return null;

              return (
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
                        This action cannot be undone. This will permanently
                        delete your member.
                      </Alert.Description>
                      <div className="flex items-end gap-4">
                        <Alert.Cancel asChild>
                          <Button>No, take me back</Button>
                        </Alert.Cancel>
                        <Alert.Action asChild>
                          <Button
                            danger
                            onClick={() =>
                              remove.mutate({
                                slug,
                                user_id,
                              })
                            }
                          >
                            Yes, delete member
                          </Button>
                        </Alert.Action>
                      </div>
                    </Alert.Content>
                  </Alert.Portal>
                </Alert.Root>
              );
            },
          },
        ]}
        emptyLabel="No members."
      />
    </Card>
  );
};

const InvitationsList = () => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");
  const role = trpc.useQuery(["team.member.role", { slug }]);

  const invitations = trpc.useQuery(["team.member.invitations", { slug }]);

  const utils = trpc.useContext();
  const remove = trpc.useMutation(["team.member.remove"], {
    async onSuccess() {
      await utils.invalidateQueries(["team.member.list", { slug }]);
      await utils.invalidateQueries(["team.member.invitations", { slug }]);
    },
  });

  return (
    <Card>
      <Text>
        <h2>Invitations 💌</h2>
      </Text>

      <List
        isLoading={invitations.isLoading}
        data={invitations.data}
        columns={[
          {
            render: ({ user }) => (
              <div className="flex items-center">
                <Avatar src={user.image} name={user.name} />
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </div>
              </div>
            ),
          },
          {
            render: ({ user_id }) => {
              const notOwner = role.data?.role !== "owner";

              if (notOwner) return null;

              return (
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
                        This action cannot be undone. This will permanently
                        delete the invitation.
                      </Alert.Description>
                      <div className="flex items-end gap-4">
                        <Alert.Cancel asChild>
                          <Button>No, take me back</Button>
                        </Alert.Cancel>
                        <Alert.Action asChild>
                          <Button
                            danger
                            onClick={() =>
                              remove.mutate({
                                slug,
                                user_id,
                              })
                            }
                          >
                            Yes, delete invitation
                          </Button>
                        </Alert.Action>
                      </div>
                    </Alert.Content>
                  </Alert.Portal>
                </Alert.Root>
              );
            },
          },
        ]}
        emptyLabel="No invitations."
      />
    </Card>
  );
};

const Page: NextLayoutPage = () => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");
  const role = trpc.useQuery(["team.member.role", { slug }]);

  return (
    <>
      {role.data?.role === "owner" ? <TeamMemberForm /> : null}

      <MembersList />

      <InvitationsList />
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
