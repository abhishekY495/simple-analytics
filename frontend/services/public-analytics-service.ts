import {
  GetChartDataRequest,
  GetChartDataResponse,
  GetStatsRequest,
  GetStatsResponse,
  GetAnalyticsRequest,
  AnalyticsResponseByType,
  GetLiveVisitorsRequest,
  GetLiveVisitorsResponse,
} from "@/types/analytics";
import { GetWebsiteByIdRequest, GetWebsiteByIdResponse } from "@/types/website";

export async function getPublicWebsiteById(
  req: GetWebsiteByIdRequest,
): Promise<GetWebsiteByIdResponse> {
  const res = await fetch(`/api/public/${req.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export async function getPublicStats(
  req: GetStatsRequest,
): Promise<GetStatsResponse> {
  const res = await fetch(
    `/api/public/${req.websiteId}/stats?start=${req.start}&end=${req.end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
}

export async function getPublicChartData(
  req: GetChartDataRequest,
): Promise<GetChartDataResponse> {
  const res = await fetch(
    `/api/public/${req.websiteId}/chart-data?start=${req.start}&end=${req.end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
}

export async function getPublicAnalytics<T extends GetAnalyticsRequest["type"]>(
  req: GetAnalyticsRequest & { type: T },
): Promise<AnalyticsResponseByType[T]> {
  const res = await fetch(
    `/api/public/${req.websiteId}/analytics?start=${req.start}&end=${req.end}&limit=${req.limit}&type=${req.type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
}

export async function getPublicLiveVisitors(
  req: GetLiveVisitorsRequest,
): Promise<GetLiveVisitorsResponse> {
  const res = await fetch(`/api/public/${req.websiteId}/live-visitors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
