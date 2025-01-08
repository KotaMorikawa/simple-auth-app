import { API_URL } from "@/config";

interface FetchOptions extends RequestInit {
  token?: string;
}

class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "APIError";
  }
}

async function fetchAPI(path: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, response.statusText, data);
  }

  return data;
}

export const api = {
  auth: {
    signUp: (data: { name: string; email: string; password: string }) =>
      fetchAPI("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    signIn: (data: { email: string; password: string }) =>
      fetchAPI("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    verifyEmail: (token: string) =>
      fetchAPI("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),

    forgotPassword: (data: { email: string }) =>
      fetchAPI("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    resetPassword: (token: string, data: { password: string }) =>
      fetchAPI("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, ...data }),
      }),
  },
};
