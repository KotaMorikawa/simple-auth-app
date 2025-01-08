import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Context } from "hono";

let prismaClient: PrismaClient | null = null;

export function getPrismaClient(c: Context) {
  if (!prismaClient) {
    const connectionString = c.env.DIRECT_URL;
    if (!connectionString) {
      throw new Error("DIRECT_URL is not defined");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({ adapter });
  }
  return prismaClient;
}

export const prisma = {
  async transaction(c: Context, fn: (prisma: PrismaClient) => Promise<any>) {
    const client = getPrismaClient(c);
    return await fn(client);
  },
};
