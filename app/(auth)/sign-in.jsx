import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link, useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Login gagal", e.message);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Masuk</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={s.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={s.input}
      />
      <Pressable style={s.btn} onPress={onSubmit}>
        <Text style={s.btnText}>Masuk</Text>
      </Pressable>

      <View style={{ height: 8 }} />
      <Link href="/(auth)/sign-up">Belum punya akun? Daftar</Link>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  btn: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "700" },
});
