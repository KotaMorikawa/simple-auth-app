import { Resend } from "resend";
import { Context } from "hono";

let resendClient: Resend | null = null;

export function getResendClient(c: Context) {
  if (!resendClient) {
    if (!c.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not defined");
    }
    resendClient = new Resend(c.env.RESEND_API_KEY);
  }
  return resendClient;
}
