import { GetWebsiteByIdResponse } from "@/types/website";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

// Get Website By ID Route
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<GetWebsiteByIdResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${API_URL}/public/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await backendRes.json();

    const res = NextResponse.json(data, { status: backendRes.status });

    return res;
  } catch {
    return NextResponse.json<GetWebsiteByIdResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
