"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getChartData } from "@/services/analytics-service";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
    theme: {
      light: "#5A9FF0",
      dark: "#5A9FF0",
    },
  },
  views: {
    label: "Views",
    theme: {
      light: "#A9CCF7",
      dark: "#A9CCF7",
    },
  },
} satisfies ChartConfig;

export default function VisitorsViewsBarChart({
  websiteId,
  startDate,
  endDate,
  accessToken,
}: {
  websiteId: string;
  startDate: string;
  endDate: string;
  accessToken: string;
}) {
  console.log("st-Date", startDate);
  console.log("ed-Date", endDate);
  console.log("----------");

  const {
    data: chartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chartData", websiteId, startDate, endDate],
    queryFn: () => getChartData({ websiteId, startDate, endDate, accessToken }),
  });

  const rows = chartData?.data ?? [];

  const rangeMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  const rangeHours = rangeMs / (1000 * 60 * 60);
  const isHourly = rangeHours <= 48;

  const formattedData = rows.map((row) => ({
    date: isHourly
      ? new Date(row.period_start).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        })
      : new Date(row.period_start).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
    visitors: row.visitors,
    views: row.views,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-[250px] items-center justify-center text-muted-foreground">
          Loading chart...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-[250px] items-center justify-center text-muted-foreground">
          Failed to load chart data.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded">
      <CardContent className="rounded">
        <ChartContainer config={chartConfig} className="h-[420px] w-full">
          <BarChart accessibilityLayer data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="visitors"
              stackId="a"
              fill="var(--color-visitors)"
              radius={[0, 0, 2, 2]}
            />
            <Bar
              dataKey="views"
              stackId="a"
              fill="var(--color-views)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
