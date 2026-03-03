import { LoginRequest, LoginResponse, RefreshTokenResponse } from "@/types/auth";

export async function loginUser(
  req: LoginRequest
): Promise<LoginResponse> {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  return res.json();
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const res = await fetch(`/api/auth/refresh-token`, {
    method: "POST",
  });

  return res.json();
}