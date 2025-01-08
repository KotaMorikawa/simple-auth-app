import { Context } from "hono";
import { z } from "zod";
import { authService } from "../../services/auth.service";

const verifyOTPSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

export const verifyOTP = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = verifyOTPSchema.parse(body);

    const user = await authService.validateTwoFactorToken(
      c,
      data.email,
      data.token
    );
    if (!user) {
      return c.json(
        {
          error: "無効なコードまたは期限切れです",
        },
        400
      );
    }

    const token = authService.createAuthToken(user, c);

    return c.json({
      success: true,
      token,
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

    console.error("OTP verification error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
