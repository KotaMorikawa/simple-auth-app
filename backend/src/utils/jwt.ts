import { Context } from "hono";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isTwoFactorEnabled: boolean;
}

export function createAuthToken(user: any, c: Context) {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
  };

  if (!c.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, c.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyJWT(token: string, c: Context) {
  if (!c.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(token, c.env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
