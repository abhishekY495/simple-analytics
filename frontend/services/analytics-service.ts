import {
  GetChartDataRequest,
  GetChartDataResponse,
  GetMetricsRequest,
  GetMetricsResponse,
  GetPageVisitorsRequest,
  GetPageVisitorsResponse,
} from "@/types/analytics";

export async function getMetrics(
  req: GetMetricsRequest,
): Promise<GetMetricsResponse> {
  const res = await fetch(
    `/api/analytics/${req.websiteId}/metrics?start_date=${req.startDate}&end_date=${req.endDate}`,
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
    `/api/analytics/${req.websiteId}/chart-data?start_date=${req.startDate}&end_date=${req.endDate}`,
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

export async function getPageVisitors(
  req: GetPageVisitorsRequest,
): Promise<GetPageVisitorsResponse> {
  const res = await fetch(
    `/api/analytics/${req.websiteId}/pages?start_date=${req.startDate}&end_date=${req.endDate}&limit=${req.limit}`,
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
