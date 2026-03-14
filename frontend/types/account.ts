import { ApiResponse } from "./api-response";

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

export type DeleteAccountRequest = {
  delete: string;
  accessToken: string;
};

export type DeleteAccountResponse = ApiResponse<null>;
