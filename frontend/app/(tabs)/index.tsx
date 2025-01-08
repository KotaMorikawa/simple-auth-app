import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../lib/contexts/auth";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>ようこそ、{user?.name}さん！</Text>
      <Text style={styles.message}>
        メールアドレスの確認
        {user?.emailVerified ? "は完了しています" : "が必要です"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#666666",
  },
});
