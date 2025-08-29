import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  doc,
  onSnapshot,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../contexts/auth-contexts";
import { useCart } from "../../contexts/CartContext";

export default function PendingTransactionPage() {
  const { transactionId } = useLocalSearchParams();
  const { userProfile } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [transactionExists, setTransactionExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [localTransactionId, setLocalTransactionId] = useState(transactionId);
  const router = useRouter();

  useEffect(() => {
    if (transactionId === "new") {
      const createPendingTransaction = async () => {
        if (!userProfile || cartItems.length === 0) return;

        const subTotal = cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        try {
          const pendingTransactionRef = await addDoc(
            collection(db, "pendingTransactions"),
            {
              customerId: userProfile.uid,
              merchantId: cartItems[0].merchantId,
              items: cartItems,
              totalAmount: subTotal,
              createdAt: serverTimestamp(),
              status: "pending",
            }
          );
          clearCart();
          setLocalTransactionId(pendingTransactionRef.id);
        } catch (error) {
          console.error("Error creating pending transaction: ", error);
        }
      };
      createPendingTransaction();
    }
  }, [transactionId, userProfile, cartItems]);

  useEffect(() => {
    if (!localTransactionId || localTransactionId === "new") return;

    const transRef = doc(db, "pendingTransactions", localTransactionId);
    const unsubscribe = onSnapshot(transRef, (doc) => {
      if (!doc.exists()) {
        setTransactionExists(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [localTransactionId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#94a3b8" }}>Memuat Transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transactionExists ? (
        <>
          <Text style={styles.title}>Tunjukkan ke Kasir</Text>
          <Text style={styles.subtitle}>
            Pindai QR Code ini untuk menyelesaikan pembayaran.
          </Text>
          <View style={styles.qrContainer}>
            <QRCode value={localTransactionId} size={256} />
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
          <Text style={styles.title}>Berhasil!</Text>
          <Text style={styles.subtitle}>
            Transaksi Anda sedang diproses oleh kasir.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>Kembali ke Beranda</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#0b1222",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 250,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
