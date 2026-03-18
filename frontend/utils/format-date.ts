import { Period } from "@/types/date-range";

const MONTH_YEAR_ONLY_PERIODS: Period[] = [
  "last3Months",
  "last6Months",
  "thisYear",
  "allTime",
];

const monthYearOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
};

const fullDateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

function getDisplayEndDate(endDate: Date, period?: Period): Date {
  if (period == null || !MONTH_YEAR_ONLY_PERIODS.includes(period)) {
    return endDate;
  }
  const displayEnd = new Date(endDate);
  displayEnd.setMonth(displayEnd.getMonth() - 1);
  return displayEnd;
}

export const formatDate = (start: string, end: string, period?: Period) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const monthYearOnly =
    period != null && MONTH_YEAR_ONLY_PERIODS.includes(period);

  const displayEndDate = getDisplayEndDate(endDate, period);

  const formattedStart = startDate.toLocaleDateString(
    "en-US",
    monthYearOnly ? monthYearOptions : fullDateOptions,
  );

  const formattedEnd = displayEndDate.toLocaleDateString(
    "en-US",
    monthYearOnly ? monthYearOptions : fullDateOptions,
  );

  if (formattedStart === formattedEnd) {
    return formattedStart;
  }

  const sameMonth =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  if (sameMonth && !monthYearOnly) {
    return startDate.toLocaleDateString("en-US", monthYearOptions);
  }

  return `${formattedStart} - ${formattedEnd}`;
};
