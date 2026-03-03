"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { decodeJwt } from "@/utils/decodeJwt";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setIsRestoring = useAuthStore((s) => s.setIsRestoring);

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch("/api/auth/refresh-token", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success") {
            const accessToken = data.data.access_token;
            const decodedAccessToken = decodeJwt(accessToken);
            if (decodedAccessToken) {
              setAuth(accessToken, { id: decodedAccessToken.id, email: decodedAccessToken.email });
            }
          }
        }
      } finally {
        setIsRestoring(false);
      }
    }

    restoreSession();
  }, [setAuth, setIsRestoring]);

  return <>{children}</>;
}
