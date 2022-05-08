import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.team.create({
    data: {
      slug: "my-team",
      name: "My Team",
      members: {
        create: {
          user_id: "ckzzhoxsx0006ozvpfekkdfz9",
        },
      },
    },
  });

  await prisma.team.delete({
    where: {
      id: data.id,
    },
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
