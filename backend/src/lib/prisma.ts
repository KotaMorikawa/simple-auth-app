import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Context } from "hono";

let prismaClient: PrismaClient | null = null;
let pool: Pool | null = null;

export async function getPrismaClient(c: Context) {
  if (!prismaClient) {
    const connectionString = c.env.DIRECT_URL;
    if (!connectionString) {
      throw new Error("DIRECT_URL is not defined");
    }

    try {
      pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prismaClient = new PrismaClient({ adapter });

      // 接続テスト
      await prismaClient.$connect();
    } catch (error) {
      await cleanup();
      throw new Error(`Failed to initialize Prisma: ${error}`);
    }
  }
  return prismaClient;
}

async function cleanup() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export const prisma = {
  async transaction(c: Context, fn: (prisma: PrismaClient) => Promise<any>) {
    const client = await getPrismaClient(c);
    try {
      return await fn(client);
    } catch (error) {
      throw error;
    }
  },
};

// アプリケーション終了時のクリーンアップ
process.on("beforeExit", async () => {
  await cleanup();
});
