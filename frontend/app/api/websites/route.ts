import {
  AddWebsiteRequest,
  AddWebsiteResponse,
  GetWebsitesResponse,
} from "@/types/website";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

// Add Website Route
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

// Get Websites Route
export async function GET(req: NextRequest) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return NextResponse.json<GetWebsitesResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/websites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });

    return res;
  } catch {
    return NextResponse.json<GetWebsitesResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
