import { API_URL } from "@/config";

export const emailApi = {
  sendVerificationEmail: async (to: string, name: string, token: string) => {
    const response = await fetch(`${API_URL}/api/email/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, name, token }),
    });

    if (!response.ok) {
      throw new Error("メール送信に失敗しました");
    }

    return response.json();
  },

  sendResetPasswordEmail: async (to: string, name: string, token: string) => {
    const response = await fetch(`${API_URL}/api/email/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, name, token }),
    });

    if (!response.ok) {
      throw new Error("メール送信に失敗しました");
    }

    return response.json();
  },
};
