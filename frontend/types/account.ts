import { ApiResponse } from "./apiResponse";

export type UpdateFullNameRequest = {
  full_name: string;
  accessToken: string;
};

export type UpdateFullNameResponse = ApiResponse<null>;

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
  accessToken: string;
};

export type ChangePasswordResponse = ApiResponse<null>;

export type ChangeEmailRequest = {
  email: string;
  accessToken: string;
};

export type ChangeEmailResponse = ApiResponse<null>;
