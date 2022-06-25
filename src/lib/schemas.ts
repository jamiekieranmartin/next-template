import { z } from "zod";

export const createTeamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Example: 'my-team'",
  }),
  name: z.string().min(1, { message: "This is required." }),
});

export type CreateTeamInputType = z.infer<typeof createTeamSchema>;

export const editTeamSchema = z.object({
  id: z.string().cuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Example: 'my-team'",
  }),
  name: z.string().min(1, { message: "This is required." }),
});

export type EditTeamInputType = z.infer<typeof editTeamSchema>;

export const inviteTeamMemberSchema = z.object({
  slug: z.string(),
  email: z.string().email(),
});

export type InviteTeamMemberInputType = z.infer<typeof inviteTeamMemberSchema>;
