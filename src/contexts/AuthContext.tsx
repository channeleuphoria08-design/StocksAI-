import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'none';

export interface UserProfile {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true, 
  isConfigured: false,
  refreshProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isConfigured = !!auth && !!db;

  const fetchProfile = async (currentUser: User) => {
    if (!db) return;
    try {
      const userRef = doc(db, 'Users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        const trialEndsAt = data.trialEndsAt?.toDate() || null;
        const subscriptionEndsAt = data.subscriptionEndsAt?.toDate() || null;
        
        let status: SubscriptionStatus = data.subscriptionStatus || 'none';
        
        // Check if trial expired
        if (status === 'trial' && trialEndsAt && new Date() > trialEndsAt) {
          status = 'expired';
          await setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
        }
        
        // Check if subscription expired
        if (status === 'active' && subscriptionEndsAt && new Date() > subscriptionEndsAt) {
          status = 'expired';
          await setDoc(userRef, { subscriptionStatus: 'expired' }, { merge: true });
        }

        setProfile({
          subscriptionStatus: status,
          trialEndsAt,
          subscriptionEndsAt
        });
      } else {
        // New user, start 3-day trial
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 3);
        
        const newProfile: UserProfile = {
          subscriptionStatus: 'trial',
          trialEndsAt,
          subscriptionEndsAt: null
        };
        
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error: any) {
      if (error.message?.includes('offline') || error.code === 'unavailable') {
        console.warn("Firestore is offline. Using fallback profile.");
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 3);
        setProfile({
          subscriptionStatus: 'trial',
          trialEndsAt,
          subscriptionEndsAt: null
        });
      } else {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isConfigured, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
