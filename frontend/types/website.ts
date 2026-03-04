import { ApiResponse } from "./apiResponse";

export type AddWebsiteRequest = {
  name: string;
  domain: string;
  accessToken: string;
};

export type AddWebsiteResponse = ApiResponse<{
  id: string;
  name: string;
  domain: string;
  created_at: string;
}>;
