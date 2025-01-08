import { Text, View, Button } from "react-native";
import { useAuth } from "../lib/contexts/auth";

export default function Index() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
