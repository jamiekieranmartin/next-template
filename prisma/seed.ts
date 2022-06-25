import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.price.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
