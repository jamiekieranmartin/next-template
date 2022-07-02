import { TRPCError } from "@trpc/server";

import { prisma } from "../db/client";

export const ensureOwner = async (slug: string, user_id: string) => {
  const isOwner = await prisma.teamMember.count({
    where: {
      team: {
        slug,
      },
      user_id,
      role: "owner",
    },
  });

  if (!isOwner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have access`,
    });
  }
};

export const ensureMember = async (slug: string, user_id: string) => {
  const isOwner = await prisma.teamMember.count({
    where: {
      team: {
        slug,
      },
      user_id,
    },
  });

  if (!isOwner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have access`,
    });
  }
};
