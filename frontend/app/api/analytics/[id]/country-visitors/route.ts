import { GetCountryVisitorsResponse } from "@/types/analytics";
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
      return NextResponse.json<GetCountryVisitorsResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");
    const limit = req.nextUrl.searchParams.get("limit");

    if (!start || !end || !limit) {
      return NextResponse.json<GetCountryVisitorsResponse>(
        {
          status: "error",
          status_message: "Invalid start or end date or limit",
        },
        { status: 400 },
      );
    }

    if (start > end) {
      return NextResponse.json<GetCountryVisitorsResponse>(
        {
          status: "error",
          status_message: "Start date must be before end date",
        },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<GetCountryVisitorsResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(
      `${API_URL}/analytics/${id}/country-visitors?start=${start}&end=${end}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await backendRes.json();

    return NextResponse.json<GetCountryVisitorsResponse>(data, {
      status: backendRes.status,
    });
  } catch {
    return NextResponse.json<GetCountryVisitorsResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
