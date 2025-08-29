import { View, Text, StyleSheet } from "react-native";

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Text>Belum ada data.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
});
