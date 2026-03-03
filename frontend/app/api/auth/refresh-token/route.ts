import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { status: "error", status_message: "No refresh token" },
      { status: 401 }
    );
  }

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    }
  );

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }

  return res;
}
