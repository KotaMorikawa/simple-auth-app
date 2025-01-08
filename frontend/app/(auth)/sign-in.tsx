import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

import { SignInForm } from "../../components/auth/SignInForm";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { api } from "../../lib/api/client";
import { useAuth } from "../../lib/contexts/auth";
import type { SignInInput } from "../../lib/validations/auth";

export default function SignInScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSignIn = async (data: SignInInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.signIn(data);
      await signIn(response.token, response.user);
      router.replace("/");
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

      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />

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
