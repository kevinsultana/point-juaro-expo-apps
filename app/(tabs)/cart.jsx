import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useCart } from "../../contexts/CartContext";
import { formatIDR } from "../../utils/formatIDR";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePreparePayment = () => {
    // Di aplikasi mobile, kita langsung siapkan datanya saja
    // Lalu navigasi ke halaman pending transaction
    // Logika pembuatan dokumen di Firestore akan ada di sana
    router.push({
      pathname: "/pending-transaction/new",
      params: { cart: JSON.stringify(cartItems) },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatIDR(item.price)}</Text>
              <View style={styles.quantityContainer}>
                <Pressable onPress={() => updateQuantity(item.id, "decrease")}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="white"
                  />
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, "increase")}>
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#fca5a5" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keranjang Anda kosong.</Text>
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.totalText}>Total: {formatIDR(subTotal)}</Text>
          <Pressable
            style={styles.checkoutButton}
            onPress={handlePreparePayment}
          >
            <Text style={styles.checkoutButtonText}>
              Siapkan QR untuk Pembayaran
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1222",
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  itemPrice: {
    color: "#94a3b8",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantity: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 16,
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 16,
    marginTop: 10,
  },
  totalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
