import { DateRange, Period } from "@/types/date-range";

export function getDateRange(period: Period): DateRange {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(todayStart);
  const day = startOfWeek.getDay(); // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  startOfWeek.setDate(startOfWeek.getDate() + diff);

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
      const start = startOfWeek;
      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisMonth": {
      const start = startOfMonth;
      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last3Months": {
      const start = new Date(todayStart);
      start.setMonth(start.getMonth() - 3);

      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "last6Months": {
      const start = new Date(todayStart);
      start.setMonth(start.getMonth() - 6);

      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "thisYear": {
      const start = startOfYear;
      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    case "allTime": {
      const start = new Date(1970, 0, 1);
      const end = new Date(now);
      return { start: start.toISOString(), end: end.toISOString() };
    }
  }
}
