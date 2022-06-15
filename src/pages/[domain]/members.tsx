import { useEffect } from "react";

import { DotsVerticalIcon } from "@heroicons/react/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Alert from "@radix-ui/react-alert-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import {
  Button,
  Form,
  Input,
  Loading,
  Avatar,
  Spinner,
} from "../../components";
import { TeamLayout } from "../../layouts";
import {
  InviteTeamMemberInputType,
  inviteTeamMemberSchema,
} from "../../lib/schemas";
import { trpc } from "../../lib/trpc";
import { NextAuthPage } from "../../lib/types";

type MemberFormProps = {
  team_id: string;
};

const MemberForm: React.FC<MemberFormProps> = ({ team_id }) => {
  const { register, handleSubmit, setValue, reset } =
    useForm<InviteTeamMemberInputType>({
      resolver: zodResolver(inviteTeamMemberSchema),
    });

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.member.invite"], {
    onSuccess(_, { team_id }) {
      utils.invalidateQueries(["team.member.list", { team_id }]);
      reset();
    },
  });

  useEffect(() => {
    setValue("team_id", team_id);
  }, [team_id, setValue]);

  return (
    <Form
      isLoading={mutation.isLoading}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <h2 className="text-xl font-bold col-span-2">Invite a Member</h2>

      <Input
        type="text"
        required
        placeholder="jamie@gmail.com"
        {...register("email")}
      >
        Email
      </Input>

      <div />

      <Button type="submit">Submit</Button>
    </Form>
  );
};

type ListProps = {
  team_id: string;
};

const List: React.FC<ListProps> = ({ team_id }) => {
  const { data: session } = useSession();

  const members = trpc.useQuery(["team.member.list", { team_id }]);
  const member = trpc.useQuery(["team.member.role", { team_id }]);

  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["team.member.remove"], {
    onSuccess() {
      utils.invalidateQueries(["team.member.list", { team_id }]);
    },
  });

  if (!members.data || !member.data) return <Spinner />;

  return (
    <>
      {member.data.role === "OWNER" ? <MemberForm team_id={team_id} /> : null}

      <div className="divide-y divide-gray-200">
        {members.data && members.data.length ? (
          members.data.map(({ team_id, user_id, user, role }, i) => (
            <div key={i} className="flex justify-between">
              <div className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar src={user.image} name={user.name} />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex gap-4 items-center justify-end">
                <Button>
                  <DotsVerticalIcon className="h-4 my-1" />
                </Button>

                <Alert.Root>
                  <Alert.Trigger
                    asChild
                    disabled={
                      member.data.role !== "OWNER" ||
                      user_id === session?.user?.id
                    }
                  >
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
                        delete your member and remove your data from our
                        servers.
                      </Alert.Description>
                      <div className="flex items-end gap-4">
                        <Alert.Cancel asChild>
                          <Button>Cancel</Button>
                        </Alert.Cancel>
                        <Alert.Action asChild>
                          <Button
                            danger
                            onClick={() =>
                              mutation.mutate({
                                team_id,
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
              </div>
            </div>
          ))
        ) : (
          <small>No members</small>
        )}
      </div>
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
    <>
      <Loading query={team}>{(team) => <List team_id={team?.id!} />}</Loading>
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
