import { Resend } from "resend";
import { VerificationEmail } from "./templates/VerificationEmail";
import { ResetPasswordEmail } from "./templates/ResetPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  sendVerificationEmail: async (to: string, name: string, token: string) => {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    return await resend.emails.send({
      from: "noreply@yourdomain.com",
      to,
      subject: "メールアドレスの確認",
      html: VerificationEmail({ name, verificationUrl }),
    });
  },

  sendResetPasswordEmail: async (to: string, name: string, token: string) => {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    return await resend.emails.send({
      from: "noreply@yourdomain.com",
      to,
      subject: "パスワードのリセット",
      html: ResetPasswordEmail({ name, resetUrl }),
    });
  },
};
