import { Context } from "hono";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { createAuthToken } from "../utils/jwt";
import { emailService } from "./email.service";
import { tokenService } from "./token.service";

interface SignupParams {
  name: string;
  email: string;
  password: string;
}

interface SigninParams {
  email: string;
  password: string;
}

export const authService = {
  async createUser(c: Context, { name, email, password }: SignupParams) {
    return await prisma.transaction(c, async (client) => {
      const existingUser = await client.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("このメールアドレスは既に登録されています");
      }

      const hashedPassword = await hashPassword(password);

      const user = await client.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // 既存の確認トークンを削除
      await client.verificationToken.deleteMany({
        where: { email },
      });

      // 新しい確認トークンを生成
      const verificationToken = await tokenService.createVerificationToken(
        c,
        email
      );

      // 確認メールを送信
      await emailService.sendVerificationEmail(c, {
        to: email,
        name,
        token: verificationToken.token,
      });

      return user;
    });
  },

  async verifyEmail(c: Context, token: string) {
    return await prisma.transaction(c, async (client) => {
      const verificationToken = await tokenService.validateToken(
        c,
        token,
        "verification"
      );
      if (!verificationToken) return null;

      const user = await client.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
      });

      await client.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return user;
    });
  },

  async validateCredentials(c: Context, { email, password }: SigninParams) {
    return await prisma.transaction(c, async (client) => {
      const user = await client.user.findUnique({
        where: { email },
      });

      if (!user?.password) return null;
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) return null;

      return user;
    });
  },

  async generateTwoFactorToken(c: Context, email: string) {
    return await prisma.transaction(c, async (client) => {
      const token = await tokenService.createTwoFactorToken(c, email);
      const user = await client.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      await emailService.sendOTP(c, {
        to: email,
        name: user.name || "",
        otp: token.token,
      });

      return token;
    });
  },

  async validateTwoFactorToken(c: Context, email: string, token: string) {
    return await prisma.transaction(c, async (client) => {
      const twoFactorToken = await tokenService.validateToken(
        c,
        token,
        "twoFactor"
      );
      if (!twoFactorToken || twoFactorToken.email !== email) return null;

      const user = await client.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      await client.twoFactorConfirmation.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });

      await client.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      return user;
    });
  },
  async getTwoFactorTokenByEmail(c: Context, email: string) {
    return await prisma.transaction(c, async (client) => {
      const token = await client.twoFactorToken.findFirst({
        where: { email },
      });
      if (!token) {
        throw new Error("二要素認証トークンが見つかりません");
      }
      return token;
    });
  },

  async deleteTwoFactorToken(c: Context, tokenId: string) {
    return await prisma.transaction(c, async (client) => {
      const token = await client.twoFactorToken.findUnique({
        where: { id: tokenId },
      });
      if (!token) {
        throw new Error("トークンが見つかりません");
      }
      return await client.twoFactorToken.delete({
        where: { id: tokenId },
      });
    });
  },

  async createTwoFactorConfirmation(c: Context, userId: string) {
    return await prisma.transaction(c, async (client) => {
      const confirmation = await client.twoFactorConfirmation.create({
        data: { userId },
      });
      return confirmation;
    });
  },

  async getTwoFactorConfirmationByUserId(c: Context, userId: string) {
    return await prisma.transaction(c, async (client) => {
      const confirmation = await client.twoFactorConfirmation.findUnique({
        where: { userId },
      });
      return confirmation;
    });
  },

  async deleteTwoFactorConfirmation(c: Context, confirmationId: string) {
    return await prisma.transaction(c, async (client) => {
      await client.twoFactorConfirmation.delete({
        where: { id: confirmationId },
      });
    });
  },

  createAuthToken(user: any, c: Context) {
    return createAuthToken(user, c);
  },
};
