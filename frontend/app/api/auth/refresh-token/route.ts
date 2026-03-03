import { API_URL } from "@/utils/constants";
import { RefreshTokenResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { status: "error", status_message: "No refresh token" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      }
    );

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });
    return res;

  } catch {
    return NextResponse.json<RefreshTokenResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 }
    );
  }
}
