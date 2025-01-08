import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "名前は必須です")
      .max(50, "名前は50文字以内で入力してください"),
    email: z
      .string()
      .min(1, "メールアドレスは必須です")
      .email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上必要です")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "パスワードは文字と数字を含む必要があります"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
  code: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "パスワードは8文字以上必要です")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "パスワードは文字と数字を含む必要があります"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
