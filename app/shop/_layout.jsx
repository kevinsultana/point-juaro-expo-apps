import { Stack } from "expo-router";

export default function ShopLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Detail Toko",
        headerStyle: { backgroundColor: "#0b1222" },
        headerTintColor: "white",
        headerTitleAlign: "center",
      }}
    />
  );
}
