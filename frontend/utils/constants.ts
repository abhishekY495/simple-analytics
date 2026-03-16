export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? "http://localhost:8080"
    : process.env.BACKEND_URL || "";

export const ICON_BASE_URL = "https://icons.duckduckgo.com/ip3";
