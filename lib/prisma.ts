import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

const dev = process.env.NODE_ENV === "development";

if (dev) global.prisma = prisma;

export default prisma;
