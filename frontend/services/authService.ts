import { LoginRequest, LoginResponse } from "@/types/auth";

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
