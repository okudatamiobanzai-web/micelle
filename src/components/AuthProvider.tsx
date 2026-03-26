"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  lineProfile: { displayName: string; pictureUrl?: string; userId: string } | null;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  lineProfile: null,
  loading: true,
  initialized: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lineProfile, setLineProfile] = useState<AuthContextType["lineProfile"]>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Dynamic import to avoid SSR issues with LIFF
        const { initAuth } = await import("@/lib/auth");
        const result = await initAuth();
        if (result) {
          setUser(result.user);
          setLineProfile(result.profile);
        }
      } catch (e) {
        console.warn("Auth init skipped:", e);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, lineProfile, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}
