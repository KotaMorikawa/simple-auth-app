import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api/client";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
      return;
    }
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await api.auth.verifyEmail(token!);
      setIsVerified(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("メールアドレスの確認に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>メールアドレスを確認しました</Text>
          <Text style={styles.subtitle}>
            メールアドレスの確認が完了しました。ログインしてサービスをご利用ください。
          </Text>
        </View>
        <Button label="ログイン" onPress={() => router.push("/sign-in")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>メールアドレスを確認中...</Text>
        <Text style={styles.subtitle}>しばらくお待ちください。</Text>
      </View>

      {error && (
        <>
          <ErrorMessage message={error} />
          <Button label="再試行" onPress={verifyEmail} loading={isLoading} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});
