import { GetMetricsRequest, GetMetricsResponse } from "@/types/analytics";

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
