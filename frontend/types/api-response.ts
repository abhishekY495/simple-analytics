export interface ApiResponse<T> {
  status: "success" | "error";
  status_message: string;
  data?: T;
}