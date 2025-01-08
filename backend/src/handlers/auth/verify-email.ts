import { Context } from "hono";
import { z } from "zod";
import { authService } from "../../services/auth.service";

const verifyEmailSchema = z.object({
  token: z.string(),
});

export const verifyEmail = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = verifyEmailSchema.parse(body);

    const user = await authService.verifyEmail(c, data.token);
    if (!user) {
      return c.json(
        {
          error: "無効なトークンまたは期限切れです",
        },
        400
      );
    }

    return c.json({
      success: true,
      message: "メールアドレスが確認されました",
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

    console.error("Email verification error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
