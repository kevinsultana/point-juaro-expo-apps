import { View, Text, StyleSheet } from "react-native";

export default function Shop() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#0b1222",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "white" },
});
