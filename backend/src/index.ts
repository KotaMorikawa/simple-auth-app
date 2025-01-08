import { Hono } from "hono";
import { cors } from "hono/cors";
import { signup } from "./handlers/auth/signup";
import { verifyEmail } from "./handlers/auth/verify-email";
import { signin } from "./handlers/auth/signin";
import { verifyOTP } from "./handlers/auth/verify-otp";
import { forgotPassword } from "./handlers/auth/forgot-password";
import { resetPassword } from "./handlers/auth/reset-password";
import { errorHandler } from "./middleware/error-handler";

const app = new Hono();

const getAllowedOrigins = (env: any) => {
  const originsString = env.ALLOWED_ORIGINS || "";
  return originsString.split(",").filter((origin: string) => origin.length > 0);
};

// CORSの設定を環境変数から取得
app.use("*", (c, next) => {
  const origins = getAllowedOrigins(c.env);
  return cors({
    origin: origins,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
  })(c, next);
});

app.use("*", errorHandler);

// 認証ルート
app.post("/api/auth/signup", signup);
app.post("/api/auth/verify-email", verifyEmail);
app.post("/api/auth/signin", signin);
app.post("/api/auth/verify-otp", verifyOTP);
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/reset-password", resetPassword);

export default app;
