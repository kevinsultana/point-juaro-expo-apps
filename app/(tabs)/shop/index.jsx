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
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../../lib/firebase";

const MerchantItem = ({ merchant }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.merchantItem}
      onPress={() => router.push(`/shop/${merchant.id}`)}
    >
      <Image source={{ uri: merchant.logoUrl }} style={styles.logo} />
      <Text style={styles.merchantName}>{merchant.name}</Text>
    </TouchableOpacity>
  );
};

export default function Shop() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getDataMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDocs(collection(db, "merchants"));
      const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMerchants(data);
    } catch (error) {
      console.error("Gagal mengambil data merchants:", error);
      setError("Tidak dapat memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataMerchants();
  }, []);

  const filteredMerchants = merchants.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Image source={require("../../../assets/logo.png")} />
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#0f172a"
              />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Cari toko..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: 20 }}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredMerchants}
            renderItem={({ item }) => <MerchantItem merchant={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            onRefresh={getDataMerchants}
            refreshing={loading}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Toko tidak ditemukan.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1222",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingTop: 10,
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
  listContainer: {
    paddingVertical: 10,
  },
  merchantItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    backgroundColor: "#121a2d",
    borderRadius: 8,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  merchantName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#fca5a5",
    textAlign: "center",
    marginTop: 20,
  },
  searchBar: {
    backgroundColor: "#121a2d",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
