import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth-contexts";
import { CartProvider } from "../contexts/CartContext";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <AuthProvider>
      <CartProvider>
        {Platform.OS === "ios" ? (
          <>
            <View style={{ height: insets.top, backgroundColor: "#0b1222" }} />
            <StatusBar style="light" />
          </>
        ) : (
          <>
            <View style={{ height: insets.top, backgroundColor: "#0b1222" }} />
            <StatusBar style="light" />
          </>
        )}
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AuthProvider>
  );
}
