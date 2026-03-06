import { DeleteAccountResponse } from "@/types/account";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return NextResponse.json<DeleteAccountResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json<DeleteAccountResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
