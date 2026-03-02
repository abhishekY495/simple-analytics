"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function Account() {
  return (
    <ProtectedRoute>
      <div>Account</div>
    </ProtectedRoute>
  );
}