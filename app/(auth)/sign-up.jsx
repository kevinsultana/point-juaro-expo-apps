import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = async () => {
    if (!email || !pass) {
      Alert.alert("Error", "Email dan password harus diisi.");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        createdAt: serverTimestamp(),
        role: "customer",
      });
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Daftar gagal", e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0b1222" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.container}>
          <Image source={require("../../assets/logo.png")} style={s.logo} />
          <Text style={s.title}>Daftar</Text>
          <Text style={s.subtitle}>Buat akun PointJuaro baru.</Text>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={s.input}
            placeholderTextColor="#94a3b8"
          />
          <View style={s.passwordContainer}>
            <TextInput
              placeholder="Password (min 6 karakter)"
              secureTextEntry={!isPasswordVisible}
              value={pass}
              onChangeText={setPass}
              style={s.inputPassword}
              placeholderTextColor="#94a3b8"
            />
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={s.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#94a3b8"
              />
            </Pressable>
          </View>
          <Pressable style={s.btn} onPress={onSubmit}>
            <Text style={s.btnText}>Buat Akun</Text>
          </Pressable>

          <View style={{ height: 8 }} />
          <Link href="/(auth)/sign-in" style={s.link}>
            Sudah punya akun? <Text style={s.linkText}>Masuk</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#0b1222",
  },
  logo: {
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inputPassword: {
    flex: 1,
    color: "white",
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    paddingRight: 16,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  link: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "bold",
  },
});
