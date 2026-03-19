import { AnalyticsResponseByType } from "@/types/analytics";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/utils/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const { id } = await params;

    if (!id) {
      return NextResponse.json<
        AnalyticsResponseByType[keyof AnalyticsResponseByType]
      >(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");
    const limit = req.nextUrl.searchParams.get("limit");
    const type = req.nextUrl.searchParams.get("type");

    if (!start || !end || !limit || !type) {
      return NextResponse.json<
        AnalyticsResponseByType[keyof AnalyticsResponseByType]
      >(
        {
          status: "error",
          status_message: "Invalid start or end date or limit or type",
        },
        { status: 400 },
      );
    }

    if (start > end) {
      return NextResponse.json<
        AnalyticsResponseByType[keyof AnalyticsResponseByType]
      >(
        {
          status: "error",
          status_message: "Start date must be before end date",
        },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<
        AnalyticsResponseByType[keyof AnalyticsResponseByType]
      >({ status: "error", status_message: "Unauthorized" }, { status: 401 });
    }

    const backendRes = await fetch(
      `${API_URL}/websites/${id}/analytics?start=${start}&end=${end}&limit=${limit}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await backendRes.json();

    return NextResponse.json<
      AnalyticsResponseByType[keyof AnalyticsResponseByType]
    >(data, {
      status: backendRes.status,
    });
  } catch {
    return NextResponse.json<
      AnalyticsResponseByType[keyof AnalyticsResponseByType]
    >(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
