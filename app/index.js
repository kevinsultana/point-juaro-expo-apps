import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/auth-contexts";

export default function Index() {
  const { user, userData, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (user && userData) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/sign-in");
    }
  }, [initializing, user, userData]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1222",
  },
});
