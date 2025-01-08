import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { api } from "../../lib/api/client";
import type { ResetPasswordInput } from "../../lib/validations/auth";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
    }
  }, [token]);

  const handleSubmit = async (data: ResetPasswordInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.resetPassword(token!, data);
      if (response.error) {
        throw new Error(response.error);
      }
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("パスワードの変更に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>パスワードを変更しました</Text>
          <Text style={styles.subtitle}>
            新しいパスワードでログインしてください。
          </Text>
        </View>
        <Link href="/sign-in" style={styles.link}>
          ログイン画面へ
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>新しいパスワードの設定</Text>
        <Text style={styles.subtitle}>
          新しいパスワードを入力してください。
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
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
  link: {
    color: "#3B82F6",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },
});
