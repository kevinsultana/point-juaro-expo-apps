import { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { formatIDR } from "../../utils/formatIDR";
import { formatIndoDate } from "../../utils/formatDate";
import { useAuth } from "../../contexts/auth-contexts";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.85;
const CARD_MARGIN = screenWidth - CARD_WIDTH * 2;

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, userData, setPendingOrders } = useAuth();
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const flatListRef = useRef(null);

  const activeMembership = memberships[activeIndex] ?? null;

  const visibleTransactions = useMemo(() => {
    if (!activeMembership) return [];
    return transactions
      .filter((t) => t.merchantId === activeMembership.merchantId)
      .sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
  }, [transactions, activeMembership]);

  useEffect(() => {
    if (!userData?.uid) return;

    const ordersQuery = query(
      collection(db, "pendingTransactions"),
      where("customerId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingOrders(orders);
    });

    return () => unsubscribe();
  }, [userData]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setMemberships([]);
      setTransactions([]);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const membershipsQuery = query(
      collection(db, "users", user.uid, "memberships")
    );
    const unsubMemberships = onSnapshot(
      membershipsQuery,
      async (snapshot) => {
        try {
          const memberListPromises = snapshot.docs.map(async (docSnapshot) => {
            const membershipData = docSnapshot.data();
            const merchantRef = doc(db, "merchants", membershipData.merchantId);
            const merchantSnap = await getDoc(merchantRef);
            const merchant = merchantSnap.exists() ? merchantSnap.data() : {};
            return {
              id: docSnapshot.id,
              ...membershipData,
              merchantName: merchant?.name ?? "Merchant",
              promotionType: merchant?.promotionSettings?.type ?? "point",
            };
          });
          const memberList = await Promise.all(memberListPromises);
          setMemberships(memberList);
          setActiveIndex((idx) => (memberList[idx] ? idx : 0));
        } catch (e) {
          setErrorMsg(e.message ?? "Gagal memuat memberships");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setErrorMsg(err.message ?? "Gagal memuat memberships");
        setLoading(false);
      }
    );

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("customerId", "==", user.uid)
    );
    const unsubTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const history = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTransactions(history);
      },
      (err) => setErrorMsg(err.message ?? "Gagal memuat transaksi")
    );

    return () => {
      unsubMemberships();
      unsubTransactions();
    };
  }, [user?.uid]);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  const storeName = activeMembership?.merchantName ?? "—";
  const qrValue = `${user?.uid ?? ""}`;
  const userName = userData?.name ?? user?.email ?? "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1222" }}>
      <View style={s.screen}>
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

        {loading ? (
          <View style={s.centerContent}>
            <ActivityIndicator color="#fff" />
            <Text style={s.loadingText}>Memuat data…</Text>
          </View>
        ) : memberships.length === 0 ? (
          <View style={s.centerContent}>
            <Text style={s.emptyMembershipText}>
              Kamu belum punya membership. Scan QR toko untuk bergabung.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              ref={flatListRef}
              horizontal
              data={memberships}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <LinearGradient
                  colors={["#22c55e", "#0ea5e9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[s.card, { width: CARD_WIDTH }]}
                >
                  <View style={s.cardHeader}>
                    <Text style={s.cardStore}>{item.merchantName}</Text>
                    <Text style={s.cardBadge}>
                      {item.promotionType === "stamp" ? "Stamps" : "Points"}
                    </Text>
                  </View>
                  <View style={s.cardMiddle}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.pointValue}>
                        {item.promotionType === "stamp"
                          ? item.stamps
                          : item.points}
                      </Text>
                      <Text style={s.pointLabel}>
                        {item.promotionType === "stamp" ? "Stamps" : "Poin"}
                      </Text>
                    </View>
                    <View style={s.qrWrap}>
                      {qrValue !== "" && (
                        <QRCode
                          value={qrValue}
                          size={88}
                          backgroundColor="transparent"
                        />
                      )}
                    </View>
                  </View>
                  <View style={s.cardFooter}>
                    <View>
                      <Text style={s.memberLabel}>Nama Member</Text>
                      <Text style={s.memberEmail}>{userName}</Text>
                    </View>
                  </View>
                </LinearGradient>
              )}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              snapToAlignment="end"
              decelerationRate="normal"
              snapToInterval={CARD_WIDTH}
              contentContainerStyle={{
                paddingHorizontal: CARD_MARGIN,
              }}
            />

            <View style={s.dots}>
              {memberships.map((_, i) => (
                <View
                  key={i}
                  style={[s.dot, i === activeIndex && s.dotActive]}
                />
              ))}
            </View>

            <Text style={s.sectionTitle}>Riwayat Transaksi di {storeName}</Text>

            {visibleTransactions.length === 0 ? (
              <View style={[s.txCard, s.centerContent]}>
                <Text style={{ color: "#94a3b8" }}>Belum ada transaksi.</Text>
              </View>
            ) : (
              visibleTransactions.map((t) => (
                <View key={t.id} style={[s.txCard, { marginBottom: 10 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.txDate}>
                      {formatIndoDate(
                        t.createdAt?.toDate ? t.createdAt.toDate() : t.createdAt
                      )}
                    </Text>
                    <Text style={s.txAmount}>{formatIDR(t.amount ?? 0)}</Text>
                  </View>
                  <Text style={s.txPoint}>
                    {t.pointsAwarded >= 0 ? `+ ${t.pointsAwarded}` : null} Poin
                  </Text>
                </View>
              ))
            )}

            {!!errorMsg && (
              <Text
                style={{ color: "#fca5a5", marginTop: 8, textAlign: "center" }}
              >
                Error: {errorMsg}
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1222",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 8,
  },
  emptyMembershipText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  brandWrap: { flexDirection: "row", alignItems: "center" },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "white",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
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
  segmentBtnActive: { backgroundColor: "#2563eb" },
  segmentText: { color: "#94a3b8", fontWeight: "700", fontSize: 16 },
  segmentTextActive: { color: "white" },
  card: {
    borderRadius: 18,
    padding: 16,
    height: 200, // Fixed height for consistency
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginHorizontal: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardStore: { color: "white", fontSize: 20, fontWeight: "800" },
  cardBadge: { color: "white", opacity: 0.9, fontWeight: "700" },
  cardMiddle: { flexDirection: "row", alignItems: "center" },
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
    alignSelf: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  memberLabel: { color: "white", opacity: 0.8, marginBottom: 2 },
  memberEmail: { color: "white", fontWeight: "700" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#334155" },
  dotActive: { backgroundColor: "#94a3b8", width: 16 },
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
