import { ApiResponse } from "./apiResponse";

export type UpdateFullNameRequest = {
  full_name: string;
  accessToken: string;
};

export type UpdateFullNameResponse = ApiResponse<null>;
