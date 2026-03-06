import { UpdateFullNameResponse } from "@/types/account";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const body = await req.json();

    if (!accessToken) {
      return NextResponse.json<UpdateFullNameResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/account/full-name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });

    return res;
  } catch {
    return NextResponse.json<UpdateFullNameResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
