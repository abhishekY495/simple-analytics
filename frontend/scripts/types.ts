import { ApiResponse } from "@/types/api-response";

export type AnalyticsPayload = {
  visit_id: string | null;
  path: string;
  referrer: string;
  user_agent: string;
};

export type AnalyticsResponse = ApiResponse<{
  visit_id: string;
}>;
