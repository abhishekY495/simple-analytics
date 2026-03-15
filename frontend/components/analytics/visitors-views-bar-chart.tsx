"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getChartData } from "@/services/analytics-service";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_CONFIG } from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";

export default function VisitorsViewsBarChart({
  websiteId,
  startDate,
  endDate,
  accessToken,
  selectedRange,
}: {
  websiteId: string;
  startDate: string;
  endDate: string;
  accessToken: string;
  selectedRange: string;
}) {
  const {
    data: chartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chartData", websiteId, startDate, endDate],
    queryFn: () => getChartData({ websiteId, startDate, endDate, accessToken }),
  });

  console.log(selectedRange);

  const rows = chartData?.data ?? [];

  const rangeMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  const rangeHours = rangeMs / (1000 * 60 * 60);
  const isHourly = rangeHours <= 48;

  let barGap = -35;
  switch (selectedRange) {
    case "this week":
      barGap = -110;
      break;
    case "this month":
      barGap = -60;
      break;
    case "last 3 months":
      barGap = -220;
      break;
    case "last 6 months":
      barGap = -125;
      break;
    case "this year":
      barGap = -220;
      break;
    case "all time":
      barGap = -10;
      break;
    default:
      barGap = -35;
      break;
  }

  const formattedData = rows.map((row) => {
    let date: string;
    if (isHourly) {
      const d = new Date(row.period_start);
      const localMinutes = d.getMinutes();
      if (localMinutes > 0) {
        d.setMinutes(0, 0, 0);
        d.setHours(d.getHours() + 1);
      }
      date = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    } else {
      date = new Date(row.period_start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return { date, visitors: row.visitors, views: row.views };
  });

  if (isLoading) {
    return (
      <Card className="rounded py-8">
        <CardContent className="flex h-[420px] items-center justify-center text-muted-foreground">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded py-8">
        <CardContent className="flex h-[420px] items-center justify-center text-muted-foreground">
          <p className="text-red-500 text-center">Failed to load chart data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded pr-8 py-8">
      <ChartContainer config={CHART_CONFIG} className="h-[420px] w-full">
        <BarChart
          accessibilityLayer
          data={formattedData}
          barCategoryGap="10%"
          barGap={barGap}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="views"
            fill="var(--color-views)"
            radius={[2, 2, 0, 0]}
            fillOpacity={0.5}
          />
          <Bar
            dataKey="visitors"
            fill="var(--color-visitors)"
            radius={[2, 2, 0, 0]}
            fillOpacity={0.5}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
