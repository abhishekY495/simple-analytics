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

export type GetWebsitesRequest = {
  accessToken: string;
};

export type GetWebsitesResponseItem = {
  id: string;
  name: string;
  domain: string;
  created_at: string;
};
export type GetWebsitesResponse = ApiResponse<GetWebsitesResponseItem[]>;
