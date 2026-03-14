import { GetChartDataResponse } from "@/types/analytics";
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
      return NextResponse.json<GetChartDataResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    const startDate = req.nextUrl.searchParams.get("start_date");
    const endDate = req.nextUrl.searchParams.get("end_date");

    if (!startDate || !endDate) {
      return NextResponse.json<GetChartDataResponse>(
        { status: "error", status_message: "Invalid start or end date" },
        { status: 400 },
      );
    }

    if (startDate > endDate) {
      return NextResponse.json<GetChartDataResponse>(
        {
          status: "error",
          status_message: "Start date must be before end date",
        },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<GetChartDataResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(
      `${API_URL}/analytics/${id}/chart-data?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json<GetChartDataResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
