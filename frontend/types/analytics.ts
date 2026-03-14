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

// Get Chart Data
export type GetChartDataRequest = {
  startDate: string;
  endDate: string;
  websiteId: string;
  accessToken: string;
};

export type ChartDataPoint = {
  period_start: string;
  visitors: number;
  views: number;
};

export type GetChartDataResponse = ApiResponse<ChartDataPoint[]>;

// Get Page Visitors
export type GetPageVisitorsRequest = {
  startDate: string;
  endDate: string;
  websiteId: string;
  accessToken: string;
  limit: number;
};

export type PageVisitor = {
  path: string;
  visitors: number;
};

export type GetPageVisitorsResponse = ApiResponse<{
  page_visitors: PageVisitor[];
}>;
