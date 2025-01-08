import { User, UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
}

export interface JWTPayload {
  userId: string;
  email: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
}

export interface SignupParams {
  name: string;
  email: string;
  password: string;
}

export interface SigninParams {
  email: string;
  password: string;
}

export interface OTPParams {
  email: string;
  token: string;
}

export interface ResetPasswordParams {
  token: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}
