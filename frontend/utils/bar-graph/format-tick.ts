import { Period } from "@/types/date-range";

export const formatTick = (value: string, period: Period): string => {
  const date = new Date(value);
  if (["last3Months", "last6Months", "thisYear", "allTime"].includes(period)) {
    return date.toLocaleDateString([], { month: "short" });
  }
  if (["thisWeek", "thisMonth"].includes(period)) {
    return date.toLocaleDateString([], { day: "numeric", month: "short" });
  }
  return date
    .toLocaleTimeString([], { hour: "numeric", hour12: true })
    .replace(" ", "");
};
