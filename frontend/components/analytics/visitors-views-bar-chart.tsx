"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getChartData } from "@/services/analytics-service";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_CONFIG } from "@/utils/constants";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { Period } from "@/types/date-range";
import { formatTick } from "@/utils/bar-graph/format-tick";
import { sortTooltipPayload } from "@/utils/bar-graph/sort-tooltip-payload";
import { getPublicChartData } from "@/services/public-analytics-service";

export default function VisitorsViewsBarChart({
  websiteId,
  start,
  end,
  accessToken,
  period,
}: {
  websiteId: string;
  start: string;
  end: string;
  accessToken?: string;
  period: Period;
}) {
  const {
    data: visitorsViewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["visitorsViews", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getChartData({ websiteId, start, end, accessToken })
        : getPublicChartData({ websiteId, start, end }),
  });

  const chartData = visitorsViewsData?.data;

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
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={Math.max(0, Math.ceil((chartData?.length ?? 0) / 12) - 1)}
            tickFormatter={(value: string) => formatTick(value, period)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <ChartTooltip
            content={(props) => (
              <ChartTooltipContent
                active={props?.active}
                label={props?.label}
                payload={sortTooltipPayload(props?.payload)}
                labelFormatter={(value: string) => formatTick(value, period)}
              />
            )}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="visitors"
            fill="var(--color-visitors)"
            radius={[2, 2, 0, 0]}
            fillOpacity={0.8}
            stackId="a"
          />
          <Bar
            dataKey="views"
            fill="var(--color-views)"
            radius={[0, 0, 2, 2]}
            fillOpacity={0.5}
            stackId="a"
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
