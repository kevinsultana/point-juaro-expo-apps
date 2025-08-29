import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { formatIDR } from "../../utils/formatIDR";
import { formatIndoDate } from "../../utils/formatDate";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const storeName = "toko buku";
  const points = 11;
  const memberName = "Nama Member";
  const memberEmail = "customer1@mail.com";
  const lastTx = {
    date: "2025-08-28",
    amount: 116550,
    points: 11,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={s.screen}>
        {/* <StatusBar barStyle="light-content" /> */}
        {/* Header */}
        <View style={s.header}>
          <View style={s.brandWrap}>
            <Image source={require("../../assets/logo.png")} />
          </View>

          <View style={s.headerActions}>
            <Pressable style={s.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#0f172a"
              />
            </Pressable>
            <Pressable style={s.iconBtn}>
              <Ionicons name="person-outline" size={20} color="#0f172a" />
            </Pressable>
          </View>
        </View>

        {/* Segmented tab Home / Promotion */}
        <View style={s.segmentWrap}>
          <Pressable
            style={[s.segmentBtn, activeTab === "Home" && s.segmentBtnActive]}
            onPress={() => setActiveTab("Home")}
          >
            <Text
              style={[
                s.segmentText,
                activeTab === "Home" ? s.segmentTextActive : null,
              ]}
            >
              Home
            </Text>
          </Pressable>
          <Pressable
            style={[
              s.segmentBtn,
              activeTab === "Promotion" && s.segmentBtnActive,
            ]}
            onPress={() => setActiveTab("Promotion")}
          >
            <Text
              style={[
                s.segmentText,
                activeTab === "Promotion" ? s.segmentTextActive : null,
              ]}
            >
              Promotion
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Loyalty Card */}
          <LinearGradient
            colors={["#22c55e", "#0ea5e9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.card}
          >
            <View style={s.cardHeader}>
              <Text style={s.cardStore}>{storeName}</Text>
              <Text style={s.cardBadge}>Points</Text>
            </View>

            <View style={s.cardMiddle}>
              <View style={{ flex: 1 }}>
                <Text style={s.pointValue}>{points}</Text>
                <Text style={s.pointLabel}>Poin</Text>
              </View>

              <View style={s.qrWrap}>
                <QRCode
                  value={`${memberEmail} | ${storeName}`}
                  size={88}
                  backgroundColor="transparent"
                />
              </View>
            </View>

            <View style={s.cardFooter}>
              <View>
                <Text style={s.memberLabel}>Nama Member</Text>
                <Text style={s.memberEmail}>{memberEmail}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Carousel dots (dummy) */}
          <View style={s.dots}>
            <View style={[s.dot, s.dotActive]} />
            <View style={s.dot} />
          </View>

          {/* History Section */}
          <Text style={s.sectionTitle}>Riwayat Transaksi di {storeName}</Text>

          <View style={s.txCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.txDate}>{formatIndoDate(lastTx.date)}</Text>
              <Text style={s.txAmount}>{formatIDR(lastTx.amount)}</Text>
            </View>
            <Text style={s.txPoint}>+{lastTx.points} Poin</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1222", // navy gelap
    paddingHorizontal: 12,
    paddingTop: 20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  brandWrap: { flexDirection: "row", alignItems: "center" },
  brandLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#2563eb",
  },
  brandText: { color: "white", fontSize: 18, fontWeight: "800" },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "white",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Segmented */
  segmentWrap: {
    flexDirection: "row",
    backgroundColor: "#121a2d",
    padding: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: {
    backgroundColor: "#2563eb",
  },
  segmentText: { color: "#94a3b8", fontWeight: "700", fontSize: 16 },
  segmentTextActive: { color: "white" },

  /* Card */
  card: {
    borderRadius: 18,
    padding: 16,
    minHeight: 170,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardStore: { color: "white", fontSize: 20, fontWeight: "800" },
  cardBadge: { color: "white", opacity: 0.9, fontWeight: "700" },
  cardMiddle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  pointValue: {
    color: "white",
    fontSize: 40,
    fontWeight: "800",
    lineHeight: 44,
  },
  pointLabel: { color: "white", opacity: 0.9, marginTop: -4 },
  qrWrap: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 10,
  },
  cardFooter: { marginTop: 18 },
  memberLabel: { color: "white", opacity: 0.8, marginBottom: 2 },
  memberEmail: { color: "white", fontWeight: "700" },

  /* Dots */
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#334155",
  },
  dotActive: { backgroundColor: "#94a3b8" },

  /* Section & Tx */
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 10,
  },
  txCard: {
    backgroundColor: "#121a2d",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  txDate: { color: "white", fontWeight: "700", marginBottom: 4 },
  txAmount: { color: "#94a3b8" },
  txPoint: { color: "#22c55e", fontWeight: "800" },
});
