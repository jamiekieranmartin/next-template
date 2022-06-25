import * as Alert from "@radix-ui/react-alert-dialog";

import { useAuth, useMembers, useRole, useSlug } from "../../lib/hooks";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Card } from "../card";
import { List } from "../list";
import { Text } from "../text";

export const MembersList = () => {
  const { session } = useAuth();

  const slug = useSlug();

  const role = useRole({ slug });
  const { members, remove } = useMembers({ slug });

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
