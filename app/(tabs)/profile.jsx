import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useAuth } from "../../contexts/auth-contexts";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";

export default function Profile() {
  const router = useRouter();
  const { userData: userProfile, initializing } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name || userProfile.email || "");
    }
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Toast.show({
        type: "success",
        text1: "Logout berhasil.",
      });
      router.replace("/(auth)/sign-in");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Logout gagal.",
      });
    }
  };

  const handleSaveName = async () => {
    if (!userProfile || !displayName.trim()) return;

    setSaving(true);
    try {
      const userDocRef = doc(db, "users", userProfile.uid);
      await updateDoc(userDocRef, {
        name: displayName.trim(),
      });
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Nama berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Gagal memperbarui nama:", error);
      Toast.show({
        type: "error",
        text1: "Gagal memperbarui nama.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Profil Saya",
          headerShown: true,
          headerStyle: { backgroundColor: "#0b1222" },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        {/* Bagian QR Code */}
        {userProfile?.uid && (
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode value={userProfile.uid} size={160} />
            </View>
            <Text style={styles.qrSubtitle}>Tunjukkan QR ini pada kasir</Text>
          </View>
        )}

        {/* Info Profil dan Edit Nama */}
        <View style={styles.infoBox}>
          {isEditing ? (
            // Tampilan saat mode edit aktif
            <View style={{ width: "100%" }}>
              <Text style={styles.editLabel}>Ubah Nama Tampilan</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholder="Masukkan nama baru"
                placeholderTextColor="#94a3b8"
              />
              <View style={styles.buttonGroup}>
                <Pressable
                  onPress={() => setIsEditing(false)}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.actionButtonText}>Batal</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveName}
                  disabled={saving}
                  style={[
                    styles.actionButton,
                    styles.saveButton,
                    saving && { opacity: 0.7 },
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.actionButtonText}>Simpan</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            // Tampilan normal
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.displayName}>{displayName}</Text>
                <Text style={styles.email}>{userProfile?.email}</Text>
              </View>
              <Pressable onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Tombol Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1222",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b1222",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  qrSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  qrSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  email: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 4,
  },
  editButtonText: {
    color: "#60a5fa",
    fontWeight: "600",
  },
  editLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#334155",
    color: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#475569",
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
