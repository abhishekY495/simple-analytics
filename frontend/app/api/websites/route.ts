import { AddWebsiteRequest, AddWebsiteResponse } from "@/types/website";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: AddWebsiteRequest = await req.json();

    const backendRes = await fetch(`${API_URL}/websites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.accessToken}`,
      },
      body: JSON.stringify({
        name: body.name,
        domain: body.domain,
      }),
    });

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });

    return res;
  } catch {
    return NextResponse.json<AddWebsiteResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
