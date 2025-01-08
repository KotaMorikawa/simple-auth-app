import { Context } from "hono";
import { z } from "zod";
import { authService } from "../../services/auth.service";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signup = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = signupSchema.parse(body);

    const user = await authService.createUser(c, data);

    return c.json({
      success: true,
      message: "確認メールを送信しました",
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

    console.error("Signup error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
