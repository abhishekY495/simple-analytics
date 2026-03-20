import { GetLiveVisitorsResponse } from "@/types/analytics";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const { id } = await params;

    if (!id) {
      return NextResponse.json<GetLiveVisitorsResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<GetLiveVisitorsResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/websites/${id}/live-visitors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json<GetLiveVisitorsResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
