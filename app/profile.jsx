import { signOut } from "firebase/auth";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { useRouter } from "expo-router";
import { auth } from "../lib/firebase";

export default function Profile() {
  const router = useRouter();

  const handleSignOut = () =>
    signOut(auth).then(() => router.replace("/(auth)/sign-in"));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Nama: Guest</Text>
      <Pressable style={styles.btn} onPress={handleSignOut}>
        <Text style={styles.btnText}>Log out</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  btn: {
    backgroundColor: "blue",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnText: { color: "white", fontWeight: "600" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
});
