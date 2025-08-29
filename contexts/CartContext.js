import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Cek jika produk berasal dari merchant yang berbeda
  const isDifferentMerchant = (merchantId) => {
    return cartItems.length > 0 && cartItems[0].merchantId !== merchantId;
  };

  const addToCart = (product, merchantId) => {
    const finalMerchantId = merchantId || product.merchantId;
    if (isDifferentMerchant(finalMerchantId)) {
      Alert.alert(
        "Toko Berbeda",
        "Anda hanya dapat membeli dari satu toko dalam satu waktu. Kosongkan keranjang untuk melanjutkan?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Ya, Kosongkan",
            onPress: () => {
              setCartItems([
                { ...product, quantity: 1, merchantId: finalMerchantId },
              ]);
            },
          },
        ]
      );
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          { ...product, quantity: 1, merchantId: finalMerchantId },
        ];
      }
    });
  };

  const updateQuantity = (id, type) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    type === "increase"
                      ? item.quantity + 1
                      : Math.max(1, item.quantity - 1),
                }
              : item
          )
          .filter((item) => item.quantity > 0) // Hapus item jika kuantitas 0
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
