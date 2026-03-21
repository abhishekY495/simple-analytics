import {
  DeleteWebsiteResponse,
  GetWebsiteByIdResponse,
  UpdateWebsiteDetailsResponse,
} from "@/types/website";
import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

// Get Website By ID Route
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const { id } = await params;

    if (!id) {
      return NextResponse.json<GetWebsiteByIdResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<GetWebsiteByIdResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/websites/${id}`, {
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
    return NextResponse.json<GetWebsiteByIdResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}

// Update Website Route
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const { id } = await params;

    if (!id) {
      return NextResponse.json<UpdateWebsiteDetailsResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    const type = req.nextUrl.searchParams.get("type");
    if (!type) {
      return NextResponse.json<UpdateWebsiteDetailsResponse>(
        { status: "error", status_message: "Type is required" },
        { status: 400 },
      );
    }

    if (type !== "details" && type !== "is_public") {
      return NextResponse.json<UpdateWebsiteDetailsResponse>(
        { status: "error", status_message: "Invalid type" },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<UpdateWebsiteDetailsResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const backendRes = await fetch(`${API_URL}/websites/${id}?type=${type}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json<UpdateWebsiteDetailsResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}

// Delete Website Route
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];
    const { id } = await params;

    if (!id) {
      return NextResponse.json<DeleteWebsiteResponse>(
        { status: "error", status_message: "Invalid website id" },
        { status: 400 },
      );
    }

    if (!accessToken) {
      return NextResponse.json<DeleteWebsiteResponse>(
        { status: "error", status_message: "Unauthorized" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_URL}/websites/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json<DeleteWebsiteResponse>(
      { status: "error", status_message: "Failed to reach the server" },
      { status: 503 },
    );
  }
}
