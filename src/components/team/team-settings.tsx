import * as Alert from "@radix-ui/react-alert-dialog";

import { useSlug, useTeams } from "../../lib/hooks";
import { Button } from "../button";
import { Card } from "../card";
import { Text } from "../text";

export const TeamSettings: React.FC = () => {
  const { remove } = useTeams();
  const slug = useSlug();

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
