import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth } from "../../lib/contexts/auth";

export default function ProfileScreen() {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>プロフィール</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button title="ログアウト" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  email: {
    fontSize: 16,
    marginBottom: 24,
  },
});
