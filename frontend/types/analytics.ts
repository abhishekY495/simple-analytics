import { ApiResponse } from "./api-response";

// Get Stats
export type GetStatsRequest = {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
};
export type GetStatsResponse = ApiResponse<{
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

// Get Analytics
export type GetAnalyticsRequest = {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
  limit: number;
  type: "page" | "referrer" | "country" | "browser" | "os" | "device";
};

// Get Page Visitors
export type PageVisitor = {
  path: string;
  visitors: number;
};
export type GetPageVisitorsResponse = ApiResponse<PageVisitor[]>;

// Get Referrer Visitors
export type ReferrerVisitor = {
  referrer: string;
  visitors: number;
};
export type GetReferrerVisitorsResponse = ApiResponse<ReferrerVisitor[]>;

// Get Country Visitors
export type CountryVisitor = {
  country: string;
  visitors: number;
};
export type GetCountryVisitorsResponse = ApiResponse<CountryVisitor[]>;

// Get Browser Visitors
export type BrowserVisitor = {
  browser: string;
  visitors: number;
};
export type GetBrowserVisitorsResponse = ApiResponse<BrowserVisitor[]>;

// Get OS Visitors
export type OsVisitor = {
  os: string;
  visitors: number;
};
export type GetOsVisitorsResponse = ApiResponse<OsVisitor[]>;

// Get Device Visitors
export type DeviceVisitor = {
  device: string;
  visitors: number;
};
export type GetDeviceVisitorsResponse = ApiResponse<DeviceVisitor[]>;

export type AnalyticsResponseByType = {
  page: GetPageVisitorsResponse;
  referrer: GetReferrerVisitorsResponse;
  country: GetCountryVisitorsResponse;
  browser: GetBrowserVisitorsResponse;
  os: GetOsVisitorsResponse;
  device: GetDeviceVisitorsResponse;
};
