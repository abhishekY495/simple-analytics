import { ApiResponse } from "./api-response";

// Get Metrics
export type GetMetricsRequest = {
  startDate: string;
  endDate: string;
  websiteId: string;
  accessToken: string;
};

export type GetMetricsResponse = ApiResponse<{
  visitors: number;
  visits: number;
  views: number;
  avg_visit_duration_seconds: number;
  prev_visitors: number;
  prev_visits: number;
  prev_views: number;
  prev_avg_visit_duration_seconds: number;
}>;
