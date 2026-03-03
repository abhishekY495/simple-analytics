"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { decodeJwt } from "@/utils/decodeJwt";
import { refreshToken } from "@/services/authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setIsRestoring = useAuthStore((s) => s.setIsRestoring);

  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await refreshToken();

        if (data.status === "error" || !data.data) {
          console.error("Error refreshing token:", data.status_message);
          setAuth(null, null);
          return;
        }

        const { access_token } = data.data;
        const decodedAccessToken = decodeJwt(access_token);
        if (decodedAccessToken) {
          setAuth(access_token, { id: decodedAccessToken.id, email: decodedAccessToken.email });
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        setAuth(null, null);
      } finally {
        setIsRestoring(false);
      }
    }

    restoreSession();
  }, [setAuth, setIsRestoring]);

  return <>{children}</>;
}
