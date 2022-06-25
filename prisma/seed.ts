import { PrismaClient } from "@prisma/client";

import {
  handleCustomer,
  handlePrice,
  handleProduct,
  handleSubscription,
  stripe,
} from "../src/lib/stripe";

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

  const products = await stripe.products.list();
  for (const product of products.data) {
    await handleProduct(product);
  }

  const prices = await stripe.prices.list();
  for (const price of prices.data) {
    await handlePrice(price);
  }

  const customers = await stripe.customers.list();
  for (const customer of customers.data) {
    await handleCustomer(customer);
  }

  const subscriptions = await stripe.subscriptions.list();
  for (const subscription of subscriptions.data) {
    await handleSubscription(subscription);
  }
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
