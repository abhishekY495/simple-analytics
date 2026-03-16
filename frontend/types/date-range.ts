export type Period =
  | "today"
  | "last24hours"
  | "thisWeek"
  | "thisMonth"
  | "last3Months"
  | "last6Months"
  | "thisYear"
  | "allTime";

export type DateRange = {
  start: string;
  end: string;
};
