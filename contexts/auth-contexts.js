import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);

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

      const ref = doc(db, "users", u?.uid);
      unsubUserDoc = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setUserData(data);
          } else {
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userData,
        setUserData,
        initializing,
        setPendingOrders,
        pendingOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
