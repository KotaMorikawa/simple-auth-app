import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../lib/contexts/auth";
import { Button } from "../../components/ui/Button";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.label}>名前</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>メールアドレス</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>メール確認状態</Text>
        <Text style={styles.value}>
          {user?.emailVerified ? "確認済み" : "未確認"}
        </Text>
      </View>

      <Button label="ログアウト" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profile: {
    flex: 1,
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: "#666666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
});
