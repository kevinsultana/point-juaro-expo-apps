import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter, Link } from "expo-router";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );
      // contoh: simpan profil minimal
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        createdAt: serverTimestamp(),
      });
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Daftar gagal", e.message);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Daftar</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={s.input}
      />
      <TextInput
        placeholder="Password (min 6)"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={s.input}
      />
      <Pressable style={s.btn} onPress={onSubmit}>
        <Text style={s.btnText}>Buat Akun</Text>
      </Pressable>

      <View style={{ height: 8 }} />
      <Link href="/(auth)/sign-in">Sudah punya akun? Masuk</Link>
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
