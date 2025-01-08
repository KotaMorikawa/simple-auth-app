import { prisma } from "../lib/prisma";
import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { Context } from "hono";

type TokenType = "verification" | "twoFactor" | "passwordReset";

export const tokenService = {
  async createVerificationToken(c: Context, email: string) {
    return await prisma.transaction(c, async (client) => {
      const token = crypto.randomUUID();
      return client.verificationToken.create({
        data: {
          email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    });
  },

  async createTwoFactorToken(c: Context, email: string) {
    return await prisma.transaction(c, async (client) => {
      const token = Math.random().toString().substring(2, 8);
      return client.twoFactorToken.create({
        data: {
          email,
          token,
          expires: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    });
  },

  async createPasswordResetToken(c: Context, email: string) {
    return await prisma.transaction(c, async (client) => {
      const token = crypto.randomUUID();
      return client.passwordResetToken.create({
        data: {
          email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    });
  },

  async validateToken(c: Context, token: string, type: TokenType) {
    return await prisma.transaction(c, async (client) => {
      let record = null;

      switch (type) {
        case "verification":
          record = await client.verificationToken.findUnique({
            where: { token },
          });
          break;
        case "twoFactor":
          record = await client.twoFactorToken.findUnique({ where: { token } });
          break;
        case "passwordReset":
          record = await client.passwordResetToken.findUnique({
            where: { token },
          });
          break;
      }

      if (!record || record.expires < new Date()) {
        return null;
      }

      return record;
    });
  },
};
