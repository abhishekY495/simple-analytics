import { ApiResponse } from "./api-response";

// Get Metrics
export type GetMetricsRequest = {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
};

export type GetMetricsResponse = ApiResponse<{
  total_visitors: number;
  total_visits: number;
  total_views: number;
  avg_visit_duration: number;
  prev_total_visitors: number;
  prev_total_visits: number;
  prev_total_views: number;
  prev_avg_visit_duration: number;
}>;

// Get Chart Data
export type GetChartDataRequest = {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
};

export type GetChartDataResponse = ApiResponse<
  {
    time: string;
    views: number;
    visitors: number;
  }[]
>;

// Get Page Visitors
export type GetPageVisitorsRequest = {
  start: string;
  end: string;
  websiteId: string;
  accessToken: string;
  limit: number;
};

export type PageVisitor = {
  path: string;
  visitors: number;
};

export type GetPageVisitorsResponse = ApiResponse<PageVisitor[]>;

// Get Referrer Visitors
export type GetReferrerVisitorsRequest = {
  start: string;
  end: string;
  websiteId: string;
  accessToken: string;
  limit: number;
};

export type ReferrerVisitor = {
  referrer: string;
  visitors: number;
};

export type GetReferrerVisitorsResponse = ApiResponse<ReferrerVisitor[]>;
