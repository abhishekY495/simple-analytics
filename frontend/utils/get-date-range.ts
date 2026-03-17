import { DateRange, Period } from "@/types/date-range";
import { ALL_TIME_START_DATE } from "./constants";

export function getDateRange(period: Period): DateRange {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const startOfWeekSunday = new Date(todayStart);
  const day = startOfWeekSunday.getDay(); // 0 = Sunday, 6 = Saturday
  startOfWeekSunday.setDate(startOfWeekSunday.getDate() - day);

  const startOfMonth = new Date(todayStart);
  startOfMonth.setDate(1);

  const startOfYear = new Date(todayStart);
  startOfYear.setMonth(0, 1);

  switch (period) {
    case "today": {
      const start = todayStart;
      const end = new Date(todayStart);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last24hours": {
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const end = now;
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisWeek": {
      const start = startOfWeekSunday;
      const end = new Date(startOfWeekSunday);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisMonth": {
      const start = startOfMonth;
      const end = new Date(startOfMonth);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last3Months": {
      const start = new Date(startOfMonth);
      start.setMonth(start.getMonth() - 3);

      const end = new Date(startOfMonth);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last6Months": {
      const start = new Date(startOfMonth);
      start.setMonth(start.getMonth() - 6);

      const end = new Date(startOfMonth);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisYear": {
      const start = startOfYear;
      const end = new Date(startOfYear);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "allTime": {
      const start = ALL_TIME_START_DATE;
      const end = new Date(startOfMonth);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }
  }
}
