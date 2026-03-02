"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

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
            const claims = decodeJwt(accessToken);
            if (claims) {
              setAuth(accessToken, { id: claims.id, email: claims.email });
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
