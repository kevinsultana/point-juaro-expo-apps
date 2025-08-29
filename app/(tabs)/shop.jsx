import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { db } from "../../lib/firebase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Shop() {
  const [merchants, setMerchants] = useState([]);
  const router = useRouter();

  const getDataMerchants = async () => {
    try {
      const res = await getDocs(collection(db, "merchants"));
      const data = res.docs.map((doc) => doc.data());
      setMerchants(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataMerchants();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Image source={require("../../assets/logo.png")} />
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#0f172a"
              />
            </Pressable>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={styles.iconBtn}
            >
              <Ionicons name="person-outline" size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* list merchant */}
        {merchants.map((merchant, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Image
              src={merchant.logoUrl}
              alt={merchant.name}
              style={{
                width: 50,
                height: 50,
                objectFit: "contain",
                borderRadius: 10,
              }}
            />
            <Text style={{ color: "white" }}>{merchant.name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1222",
    paddingHorizontal: 12,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "white",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  brandWrap: { flexDirection: "row", alignItems: "center" },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "white" },
});
