import { ApiResponse } from "./api-response";

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
