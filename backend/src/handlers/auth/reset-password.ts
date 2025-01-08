import { Context } from "hono";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/password";
import { tokenService } from "../../services/token.service";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export const resetPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = resetPasswordSchema.parse(body);

    const tokenRecord = await tokenService.validateToken(
      c,
      data.token,
      "passwordReset"
    );
    if (!tokenRecord) {
      return c.json(
        {
          error: "無効なトークンまたは期限切れです",
        },
        400
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(data.password);

    await prisma.transaction(c, async (client) => {
      // パスワードの更新
      await client.user.update({
        where: { email: tokenRecord.email },
        data: { password: hashedPassword },
      });

      // トークンの削除
      await client.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      });
    });

    return c.json({
      success: true,
      message: "パスワードが更新されました",
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

    console.error("Password reset error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
