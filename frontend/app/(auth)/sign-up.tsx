import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { SignUpForm } from "../../components/auth/SignUpForm";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { api } from "../../lib/api/client";
import type { SignUpInput } from "../../lib/validations/auth";

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const handleSignUp = async (data: SignUpInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.signUp(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setIsEmailSent(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("アカウント作成に失敗しました。");
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
            確認メールを送信しました。メールの指示に従ってアカウントを有効化してください。
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
        <Text style={styles.title}>アカウント作成</Text>
        <Text style={styles.subtitle}>
          必要な情報を入力して、アカウントを作成してください。
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <SignUpForm
        onSubmit={async (data) => {
          await handleSignUp(data);
        }}
        isLoading={isLoading}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>すでにアカウントをお持ちですか？</Text>
        <Link href="/sign-in" style={styles.link}>
          ログイン
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
});
