import { DateRange, Period } from "@/types/date-range";
import { ALL_TIME_START_DATE } from "./constants";

export function getDateRange(period: Period, offset = 0): DateRange {
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
      const targetDay = new Date(todayStart);
      targetDay.setDate(targetDay.getDate() + offset);

      const start = targetDay;
      const end = new Date(targetDay);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last24hours": {
      const end = new Date(now);
      end.setMinutes(0, 0, 0);
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
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
      const startOfMonthOffset = new Date(startOfMonth);
      startOfMonthOffset.setMonth(startOfMonthOffset.getMonth() + offset);

      const start = startOfMonthOffset;
      const end = new Date(startOfMonthOffset);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last3Months": {
      const startOfMonthUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      const start = new Date(startOfMonthUTC);
      start.setUTCMonth(start.getUTCMonth() - 3);

      const end = new Date(startOfMonthUTC);
      end.setUTCMonth(end.getUTCMonth() + 1, 0);
      end.setUTCHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last6Months": {
      const startOfMonthUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      const start = new Date(startOfMonthUTC);
      start.setUTCMonth(start.getUTCMonth() - 5);

      const end = new Date(startOfMonthUTC);
      end.setUTCMonth(end.getUTCMonth() + 1, 0);
      end.setUTCHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisYear": {
      const startOfYearUTC = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const start = startOfYearUTC;
      const end = new Date(startOfYearUTC);
      end.setUTCMonth(11, 31);
      end.setUTCHours(23, 59, 59, 999);
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
