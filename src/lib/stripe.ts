import Stripe from "stripe";

import { prisma } from "./prisma";
import { toDateTime } from "./utils";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2020-08-27",
});

export const handleProduct = async (product: Stripe.Product) => {
  await prisma.product.upsert({
    create: {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      metadata: product.metadata,
    },
    update: {
      active: product.active,
      name: product.name,
      description: product.description,
      metadata: product.metadata,
    },
    where: {
      id: product.id,
    },
  });
};

export const handlePrice = async (price: Stripe.Price) => {
  await prisma.price.upsert({
    create: {
      id: price.id,
      active: price.active,
      nickname: price.nickname,
      unit_amount: price.unit_amount,
      currency: price.currency,
      type: price.type,
      recurring_interval: price.recurring?.interval,
      recurring_interval_count: price.recurring?.interval_count,
      recurring_trial_period_days: price.recurring?.trial_period_days,
      metadata: price.metadata,
      product: {
        connect: {
          id:
            typeof price.product === "string"
              ? price.product
              : price.product.id,
        },
      },
    },
    update: {
      active: price.active,
      nickname: price.nickname,
      unit_amount: price.unit_amount,
      currency: price.currency,
      type: price.type,
      recurring_interval: price.recurring?.interval,
      recurring_interval_count: price.recurring?.interval_count,
      recurring_trial_period_days: price.recurring?.trial_period_days,
      metadata: price.metadata,
      product_id:
        typeof price.product === "string" ? price.product : price.product.id,
    },
    where: {
      id: price.id,
    },
  });
};

export const handleSubscription = async (subscription: Stripe.Subscription) => {
  await prisma.subscription.upsert({
    create: {
      id: subscription.id,
      status: subscription.status,
      quantity: 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: toDateTime(subscription.current_period_start),
      current_period_end: toDateTime(subscription.current_period_end),
      ended_at: toDateTime(subscription.ended_at),
      cancel_at: toDateTime(subscription.cancel_at),
      canceled_at: toDateTime(subscription.canceled_at),
      trial_start: toDateTime(subscription.trial_start),
      trial_end: toDateTime(subscription.trial_end),
      metadata: subscription.metadata,
      customer: {
        connect: {
          id:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
        },
      },
      price: {
        connect: {
          id: subscription.items.data[0]!.price.id,
        },
      },
    },
    update: {
      status: subscription.status,
      quantity: 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: toDateTime(subscription.current_period_start),
      current_period_end: toDateTime(subscription.current_period_end),
      ended_at: toDateTime(subscription.ended_at),
      cancel_at: toDateTime(subscription.cancel_at),
      canceled_at: toDateTime(subscription.canceled_at),
      trial_start: toDateTime(subscription.trial_start),
      trial_end: toDateTime(subscription.trial_end),
      metadata: subscription.metadata,
      customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      price_id: subscription.items.data[0]!.price.id,
    },
    where: {
      id: subscription.id,
    },
  });
};

export const handleCustomer = async (customer: Stripe.Customer) => {
  await prisma.customer.upsert({
    create: {
      id: customer.id,
      metadata: customer.metadata,
      user: {
        connect: {
          id: customer.metadata.user_id,
        },
      },
    },
    update: {
      metadata: customer.metadata,
      user_id: customer.metadata.user_id,
    },
    where: {
      id: customer.id,
    },
  });
};
