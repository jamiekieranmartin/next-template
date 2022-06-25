import { useEffect } from "react";
import router from "next/router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useTeam } from "../../lib/hooks";
import { EditTeamInputType, editTeamSchema } from "../../lib/schemas";
import { trpc } from "../../lib/trpc";
import { Button } from "../button";
import { Card } from "../card";
import { Form } from "../form";
import { Input } from "../input";
import { Text } from "../text";

export const TeamForm: React.FC = () => {
  const team = useTeam();

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
    if (team?.data?.id) {
      setValue("id", team?.data.id);
    }
    if (team?.data?.name) {
      setValue("slug", team?.data.slug);
    }
    if (team?.data?.slug) {
      setValue("name", team?.data.name);
    }
  }, [team?.data, setValue]);

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
          disabled={team?.data?.slug === slug && team?.data?.name === name}
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
};
