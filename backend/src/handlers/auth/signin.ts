import { Context } from "hono";
import { z } from "zod";
import { authService } from "../../services/auth.service";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signin = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = signinSchema.parse(body);

    const user = await authService.validateCredentials(c, data);
    if (!user) {
      return c.json(
        {
          error: "メールアドレスまたはパスワードが正しくありません",
        },
        400
      );
    }

    if (!user.emailVerified) {
      return c.json(
        {
          error: "メールアドレスが確認されていません",
        },
        400
      );
    }

    // 2要素認証が有効な場合
    if (user.isTwoFactorEnabled) {
      if (body.code) {
        // コードが提供されている場合
        const twoFactorToken = await authService.getTwoFactorTokenByEmail(
          c,
          user.email!
        );
        if (!twoFactorToken || twoFactorToken.token !== body.code) {
          return c.json(
            {
              error: "認証コードが間違っています。",
            },
            400
          );
        }

        const hasExpired = new Date() > twoFactorToken.expires;
        if (hasExpired) {
          return c.json(
            {
              error: "認証コードが期限切れです。",
            },
            400
          );
        }

        await authService.deleteTwoFactorToken(c, twoFactorToken.id);

        const existingConfirmation =
          await authService.getTwoFactorConfirmationByUserId(c, user.id);

        if (existingConfirmation) {
          await authService.deleteTwoFactorConfirmation(
            c,
            existingConfirmation.id
          );
        }

        await authService.createTwoFactorConfirmation(c, user.id);
      } else {
        // コードが提供されていない場合
        await authService.generateTwoFactorToken(c, user.email!);
        return c.json({
          success: true,
          requiresOTP: true,
          message: "認証コードを送信しました",
        });
      }
    }

    // JWTトークンの生成
    const token = authService.createAuthToken(user, c);

    return c.json({
      success: true,
      token,
      user,
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

    console.error("Signin error:", error);
    return c.json(
      {
        error: "予期せぬエラーが発生しました",
      },
      500
    );
  }
};
