import {
  GetChartDataRequest,
  GetChartDataResponse,
  GetCountryVisitorsRequest,
  GetCountryVisitorsResponse,
  GetMetricsRequest,
  GetMetricsResponse,
  GetPageVisitorsRequest,
  GetPageVisitorsResponse,
  GetReferrerVisitorsRequest,
  GetReferrerVisitorsResponse,
} from "@/types/analytics";

export async function getMetrics(
  req: GetMetricsRequest,
): Promise<GetMetricsResponse> {
  const res = await fetch(
    `/api/analytics/${req.websiteId}/metrics?start=${req.start}&end=${req.end}`,
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
    `/api/analytics/${req.websiteId}/chart-data?start=${req.start}&end=${req.end}`,
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
    `/api/analytics/${req.websiteId}/page-visitors?start=${req.start}&end=${req.end}&limit=${req.limit}`,
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

export async function getReferrerVisitors(
  req: GetReferrerVisitorsRequest,
): Promise<GetReferrerVisitorsResponse> {
  const res = await fetch(
    `/api/analytics/${req.websiteId}/referrer-visitors?start=${req.start}&end=${req.end}&limit=${req.limit}`,
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

export async function getCountryVisitors(
  req: GetCountryVisitorsRequest,
): Promise<GetCountryVisitorsResponse> {
  const res = await fetch(
    `/api/analytics/${req.websiteId}/country-visitors?start=${req.start}&end=${req.end}&limit=${req.limit}`,
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
