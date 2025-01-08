declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DIRECT_URL: string;
      AUTH_SECRET: string;
      JWT_SECRET: string;
      RESEND_API_KEY: string;
      APP_URL: string;
    }
  }
}
