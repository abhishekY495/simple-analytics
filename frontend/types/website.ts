import { ApiResponse } from "./api-response";

// Add Website
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

// Get Websites
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

// Get Website By ID
export type GetWebsiteByIdRequest = {
  id: string;
  accessToken: string;
};
export type GetWebsiteByIdResponseItem = {
  id: string;
  name: string;
  domain: string;
  is_public: boolean;
  created_at: string;
};
export type GetWebsiteByIdResponse = ApiResponse<GetWebsiteByIdResponseItem>;

// Delete Website
export type DeleteWebsiteRequest = {
  id: string;
  accessToken: string;
};
export type DeleteWebsiteResponse = ApiResponse<null>;

// Update Website
export type UpdateWebsiteRequest = {
  id: string;
  name: string;
  domain: string;
  accessToken: string;
};
export type UpdateWebsiteResponse = ApiResponse<{
  id: string;
  name: string;
  domain: string;
  created_at: string;
}>;
