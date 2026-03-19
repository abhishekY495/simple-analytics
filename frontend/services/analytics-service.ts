import {
  GetChartDataRequest,
  GetChartDataResponse,
  GetStatsRequest,
  GetStatsResponse,
  GetAnalyticsRequest,
  AnalyticsResponseByType,
} from "@/types/analytics";

export async function getStats(
  req: GetStatsRequest,
): Promise<GetStatsResponse> {
  const res = await fetch(
    `/api/websites/${req.websiteId}/stats?start=${req.start}&end=${req.end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.accessToken}`,
      },
    },
  );
  return res.json();
}

export async function getChartData(
  req: GetChartDataRequest,
): Promise<GetChartDataResponse> {
  const res = await fetch(
    `/api/websites/${req.websiteId}/chart-data?start=${req.start}&end=${req.end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.accessToken}`,
      },
    },
  );
  return res.json();
}

export async function getAnalytics<T extends GetAnalyticsRequest["type"]>(
  req: GetAnalyticsRequest & { type: T },
): Promise<AnalyticsResponseByType[T]> {
  const res = await fetch(
    `/api/websites/${req.websiteId}/analytics?start=${req.start}&end=${req.end}&limit=${req.limit}&type=${req.type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.accessToken}`,
      },
    },
  );
  return res.json();
}
