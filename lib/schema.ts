import { z } from "zod";

export const team_create = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Example: 'my-team'",
  }),
  name: z.string().min(1, { message: "This is required." }),
});

export const team_edit = z.object({
  id: z.string().cuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Example: 'my-team'",
  }),
  name: z.string().min(1, { message: "This is required." }),
});

export const team_member_invite = z.object({
  team_id: z.string().cuid(),
  email: z.string().email(),
});
