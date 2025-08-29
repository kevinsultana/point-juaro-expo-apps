import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { formatIDR } from "../../utils/formatIDR";

const ProductItem = ({ item }) => (
  <View style={styles.productCard}>
    <Image source={{ uri: item.imgUrl }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{formatIDR(item.price)}</Text>
    </View>
  </View>
);

export default function MerchantDetail() {
  const { id } = useLocalSearchParams();
  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMerchantData = async () => {
    setLoading(true);
    setError(null);
    try {
      const merchantRef = doc(db, "merchants", id);
      const docSnap = await getDoc(merchantRef);

      if (docSnap.exists()) {
        setMerchant({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Toko tidak ditemukan.");
        setLoading(false);
        return;
      }

      const productsQuery = await getDocs(
        collection(db, "merchants", id, "products")
      );
      const productsData = productsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal memuat data toko.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getMerchantData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: merchant?.name || "Detail Toko",
          headerStyle: { backgroundColor: "#0b1222" },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
      <FlatList
        data={products}
        renderItem={ProductItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada produk.</Text>
        }
        contentContainerStyle={styles.container}
        onRefresh={getMerchantData}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1222",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b1222",
  },
  container: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  errorText: {
    color: "#fca5a5",
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },
  // Style untuk setiap kartu produk
  productCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  productPrice: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 4,
  },
});
