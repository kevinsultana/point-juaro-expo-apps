import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Alert } from "react-native";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let unsubUserDoc = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (!u) {
        setUserData(null);
        setInitializing(false);
        return;
      }

      const ref = doc(db, "users", u.uid);
      unsubUserDoc = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            // Cek peran pengguna
            if (data.role !== "customer") {
              Alert.alert(
                "Akses Ditolak",
                "Aplikasi ini hanya untuk pelanggan. Silakan gunakan situs web untuk Login.",
                [
                  {
                    text: "OK",
                    // Cukup panggil signOut. Navigasi akan ditangani secara otomatis.
                    onPress: () => signOut(auth),
                  },
                ],
                { cancelable: false }
              );
              setUserData(null);
            } else {
              setUserData(data);
            }
          } else {
            // Jika dokumen pengguna tidak ada di Firestore, logout
            signOut(auth);
            setUserData(null);
          }
          setInitializing(false);
        },
        (err) => {
          console.warn("users onSnapshot error:", err);
          signOut(auth);
          setUserData(null);
          setInitializing(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
