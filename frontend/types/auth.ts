import { ApiResponse } from "./apiResponse";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = ApiResponse<{
    id: string;
    full_name: string;
    email: string;
    access_token: string;
}>;

export type RefreshTokenResponse = ApiResponse<{
    access_token: string;
}>;