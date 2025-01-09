import { Context } from "hono";
import { getResendClient } from "../lib/resend";
import { createDeepLink } from "utils/deepLink";
import { render } from "@react-email/render";
import { VerificationEmail } from "../emails/VerificationEmail";
import { OTPEmail } from "../emails/OTPEmail";

interface EmailParams {
  to: string;
  name: string;
  token: string;
}

interface OTPParams {
  to: string;
  name: string;
  otp: string;
}

const createPasswordResetEmailHtml = ({
  name,
  token,
}: Omit<EmailParams, "to">) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb;">パスワードリセット</h1>
      <p>こんにちは ${name} さん</p>
      <p>以下のリンクをクリックしてパスワードをリセットしてください：</p>
      <a href="${process.env.APP_URL}/reset-password?token=${token}"
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
        パスワードをリセット
      </a>
      <p style="margin-top: 20px; color: #666;">このリンクは24時間有効です。</p>
    </div>
  </body>
</html>
`;

export const emailService = {
  async sendVerificationEmail(c: Context, { to, name, token }: EmailParams) {
    const resend = getResendClient(c);
    const verificationUrl = createDeepLink(c, "verify-email", { token });
    const html = await render(
      VerificationEmail({ email: to, confirmLink: verificationUrl })
    );

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "メールアドレス確認",
      html,
    });
  },

  async sendOTP(c: Context, { to, name, otp }: OTPParams) {
    const resend = getResendClient(c);
    const html = await render(OTPEmail({ name, otp }));

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "認証コード",
      html,
    });
  },

  async sendPasswordReset(c: Context, { to, name, token }: EmailParams) {
    const resend = getResendClient(c);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "パスワードリセット",
      html: createPasswordResetEmailHtml({ name, token }),
    });
  },
};
