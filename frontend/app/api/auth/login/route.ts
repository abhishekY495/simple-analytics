import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch {
    return NextResponse.json<LoginResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 }
    );
  }
}