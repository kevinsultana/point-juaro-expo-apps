import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../contexts/auth-contexts";
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "expo-router";
import { formatIDR } from "../../utils/formatIDR";
import { Ionicons } from "@expo/vector-icons";

export default function Orders() {
  const { userData: userProfile } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userProfile?.uid) return;

    const ordersQuery = query(
      collection(db, "pendingTransactions"),
      where("customerId", "==", userProfile.uid)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <FlatList
          data={pendingOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.orderItem}
              onPress={() => router.push(`/pending-transaction/${item.id}`)}
            >
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  Pesanan Di {item.merchantName}
                </Text>
                <Text style={styles.orderId}>
                  Order #{item.id.substring(0, 10)}...
                </Text>
                <Text style={styles.orderTotal}>
                  Total: {formatIDR(item.totalAmount)}
                </Text>
                <Text style={styles.orderDate}>
                  Dibuat pada:{" "}
                  {new Date(item.createdAt?.seconds * 1000).toLocaleString(
                    "id-ID"
                  )}
                </Text>
              </View>
              <Ionicons name="qr-code-outline" size={28} color="#60a5fa" />
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada pesanan aktif.</Text>
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b1222",
  },
  orderItem: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  orderTotal: {
    color: "#94a3b8",
    marginTop: 4,
  },
  orderDate: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 6,
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },
});
