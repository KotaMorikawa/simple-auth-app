import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { api } from "../../lib/api/client";
import type { ForgotPasswordInput } from "../../lib/validations/auth";

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const handleSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.auth.forgotPassword(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setIsEmailSent(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("パスワードリセットメールの送信に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>メールを確認してください</Text>
          <Text style={styles.subtitle}>
            パスワードリセット用のリンクを送信しました。メールの指示に従ってパスワードをリセットしてください。
          </Text>
        </View>
        <Link href="/sign-in" style={styles.link}>
          ログイン画面に戻る
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>パスワードをお忘れですか？</Text>
        <Text style={styles.subtitle}>
          登録したメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />

      <View style={styles.footer}>
        <Link href="/sign-in" style={styles.link}>
          ログイン画面に戻る
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
    alignItems: "center",
    marginTop: 24,
  },
  link: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});
