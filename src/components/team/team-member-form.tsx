import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMembers, useSlug } from "../../lib/hooks";
import {
  InviteTeamMemberInputType,
  inviteTeamMemberSchema,
} from "../../lib/schemas";
import { Button } from "../button";
import { Card } from "../card";
import { Form } from "../form";
import { Input } from "../input";
import { Text } from "../text";

export const TeamMemberForm: React.FC = () => {
  const slug = useSlug();
  const { invite } = useMembers({ slug });

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
