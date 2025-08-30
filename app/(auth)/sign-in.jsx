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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
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
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Login gagal", e.message);
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
          <Text style={s.title}>Login</Text>
          <Text style={s.subtitle}>
            Masuk untuk melanjutkan ke akun PointJuaro Anda.
          </Text>
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
              placeholder="Password"
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
            <Text style={s.btnText}>Masuk</Text>
          </Pressable>

          <View style={{ height: 8 }} />
          <Link href="/(auth)/sign-up" style={s.link}>
            Belum punya akun? <Text style={s.linkText}>Daftar</Text>
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
