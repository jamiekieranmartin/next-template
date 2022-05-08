import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user_id = "cl2x5u4130010tsvp8lgsdbj7";

  const team = await prisma.team.create({
    data: {
      domain: "my-team",
      name: "My Team",
      members: {
        create: {
          user_id,
          accepted: true,
          role: "OWNER",
        },
      },
    },
  });

  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      stripe_account: {
        create: {
          stripe_id: "acct_1Kx74BRLefo8ZISq",
          default_currency: "aud",
          charges_enabled: true,
          payouts_enabled: true,
        },
      },
    },
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
