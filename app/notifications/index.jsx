import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationScreen() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0b1222",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Ionicons
        name="construct-outline"
        size={48}
        color="#2563eb"
        style={{ marginBottom: 16 }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        Notification
      </Text>
      <Text style={{ color: "#94a3b8", textAlign: "center" }}>
        Halaman ini sedang dalam pengembangan.
      </Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text
          style={{
            color: "#2563eb",
            marginTop: 16,
            backgroundColor: "white",
            padding: 8,
            borderRadius: 10,
          }}
        >
          Kembali
        </Text>
      </TouchableOpacity>
    </View>
  );
}
