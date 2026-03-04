"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isRestoring = useAuthStore((s) => s.isRestoring);

  useEffect(() => {
    if (!isRestoring && !accessToken) {
      router.replace("/login");
    }
  }, [isRestoring, accessToken, router]);

  if (isRestoring) {
    return (
      <div className="text-muted-foreground flex justify-center mt-20">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
