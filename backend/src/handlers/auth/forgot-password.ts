import { Context } from "hono";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { emailService } from "../../services/email.service";
import { tokenService } from "../../services/token.service";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = forgotPasswordSchema.parse(body);

    const user = await prisma.transaction(c, async (client) => {
      const user = await client.user.findUnique({
        where: { email: data.email },
      });

      if (!user) return null;

      // 既存のリセットトークンを削除
      await client.passwordResetToken.deleteMany({
        where: { email: data.email },
      });

      return user;
    });

    if (!user) {
      // セキュリティのため、ユーザーが存在しない場合でも同じメッセージを返す
      return c.json({
        success: true,
        message: "パスワードリセット用のメールを送信しました",
      });
    }

    // 新しいリセットトークンを生成
    const resetToken = await tokenService.createPasswordResetToken(
      c,
      data.email
    );

    // リセットメールを送信
    await emailService.sendPasswordReset(c, {
      to: data.email,
      name: user.name || "",
      token: resetToken.token,
    });

    return c.json({
      success: true,
      message: "パスワードリセット用のメールを送信しました",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: "バリデーションエラー",
          details: error.errors,
        },
        400
      );
    }

    console.error("Password reset request error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
