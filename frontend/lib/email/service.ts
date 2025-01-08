import { emailApi } from "../api/email";

export const emailService = {
  sendVerificationEmail: async (to: string, name: string, token: string) => {
    return await emailApi.sendVerificationEmail(to, name, token);
  },

  sendResetPasswordEmail: async (to: string, name: string, token: string) => {
    return await emailApi.sendResetPasswordEmail(to, name, token);
  },
};
