import { Context } from "hono";
import { getResendClient } from "../lib/resend";
import { createDeepLink } from "utils/deepLink";

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

const createVerificationEmailHtml = ({
  name,
  token,
  c,
}: Omit<EmailParams, "to"> & { c: Context }) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb;">メールアドレスの確認</h1>
      <p>こんにちは ${name} さん</p>
      <p>以下のリンクをクリックしてメールアドレスを確認してください：</p>
      <p>以下のリンクをクリックしてメールアドレスを確認してください：</p>
      <p style="color: #2563eb;">このリンクが確認できます: <strong><a href="${createDeepLink(c, "verify-email", { token })}">${createDeepLink(c, "verify-email", { token })}</a></strong></p>
      <a href="${createDeepLink(c, "verify-email", { token })}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
        メールアドレスを確認する
      </a>
      <p style="margin-top: 20px; color: #666;">このリンクは24時間有効です。</p>
    </div>
  </body>
</html>
`;

const createOTPEmailHtml = ({ name, otp }: Omit<OTPParams, "to">) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb;">認証コード</h1>
      <p>こんにちは ${name} さん</p>
      <p>あなたの認証コードは：</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="margin-top: 20px; color: #666;">このコードは10分間有効です。</p>
    </div>
  </body>
</html>
`;

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
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "メールアドレス確認",
      html: createVerificationEmailHtml({ name, token, c }),
    });
  },

  async sendOTP(c: Context, { to, name, otp }: OTPParams) {
    const resend = getResendClient(c);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "認証コード",
      html: createOTPEmailHtml({ name, otp }),
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
