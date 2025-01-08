import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

import { SignInForm } from "../../components/auth/SignInForm";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { api } from "../../lib/api/client";
import { useAuth } from "../../lib/contexts/auth";
import type { SignInInput } from "../../lib/validations/auth";

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresOTP, setRequiresOTP] = useState(false); // OTPが必要かどうかの状態を追加
  const { signIn } = useAuth();

  const handleSignIn = async (data: SignInInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.signIn(data);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.requiresOTP) {
        setRequiresOTP(true); // OTPが必要な場合、状態を更新
      } else {
        await signIn(response.token, response.user);
        router.replace("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("ログインに失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ログイン</Text>
        <Text style={styles.subtitle}>
          メールアドレスとパスワードを入力してログインしてください。
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <SignInForm
        onSubmit={(data) =>
          handleSignIn({ ...data, code: requiresOTP ? data.code : undefined })
        }
        isLoading={isLoading}
        requiresOTP={requiresOTP}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>アカウントをお持ちでないですか？</Text>
        <Link href="/sign-up" style={styles.link}>
          アカウント作成
        </Link>
      </View>
      <View style={styles.forgotPassword}>
        <Link href="/forgot-password" style={styles.link}>
          パスワードをお忘れですか？
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#666666",
  },
  link: {
    marginLeft: 8,
    color: "#3B82F6",
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
});
