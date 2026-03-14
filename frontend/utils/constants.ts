import { ChartConfig } from "@/components/ui/chart";

export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? "http://localhost:8080"
    : process.env.BACKEND_URL || "";

export const ICON_BASE_URL = "https://icons.duckduckgo.com/ip3";

export const DATE_FILTERS = [
  {
    label: "Today",
    value: "today",
    separator: false,
  },
  {
    label: "Last 24 hours",
    value: "last 24 hours",
    separator: true,
  },
  {
    label: "This week",
    value: "this week",
    separator: false,
  },
  {
    label: "This month",
    value: "this month",
    separator: true,
  },
  {
    label: "Last 3 months",
    value: "last 3 months",
    separator: false,
  },
  {
    label: "Last 6 months",
    value: "last 6 months",
    separator: true,
  },
  {
    label: "This year",
    value: "this year",
    separator: false,
  },
  {
    label: "All time",
    value: "all time",
    separator: false,
  },
];

export const CHART_CONFIG = {
  visitors: {
    label: "Visitors",
    color: "#0072ff",
  },
  views: {
    label: "Views",
    color: "#4c9cffd4",
  },
} satisfies ChartConfig;
