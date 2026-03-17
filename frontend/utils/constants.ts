import { ChartConfig } from "@/components/ui/chart";

export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? "http://localhost:8080"
    : process.env.BACKEND_URL || "";

export const ICON_BASE_URL = "https://icons.duckduckgo.com/ip3";

export const ALL_TIME_START_DATE = new Date("2026-01-01T00:00:00.000Z");

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

export const DATE_RANGE_FILTERS = [
  {
    label: "Today",
    value: "today",
    separator: false,
  },
  {
    label: "Last 24 hours",
    value: "last24hours",
    separator: true,
  },
  {
    label: "This week",
    value: "thisWeek",
    separator: false,
  },
  {
    label: "This month",
    value: "thisMonth",
    separator: true,
  },
  {
    label: "Last 3 months",
    value: "last3Months",
    separator: false,
  },
  {
    label: "Last 6 months",
    value: "last6Months",
    separator: true,
  },
  {
    label: "This year",
    value: "thisYear",
    separator: false,
  },
  {
    label: "All time",
    value: "allTime",
    separator: false,
  },
];
