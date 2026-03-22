import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { ChangePercentage } from "./change-percentage";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatTime } from "@/utils/format-time";
import { getStats } from "@/services/analytics-service";
import { getPublicStats } from "@/services/public-analytics-service";

export default function Stats({
  websiteId,
  start,
  end,
  accessToken,
}: {
  websiteId: string;
  start: string;
  end: string;
  accessToken?: string;
}) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stats", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getStats({ websiteId, start, end, accessToken })
        : getPublicStats({ websiteId, start, end }),
  });

  const statsData = stats?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 h-[146px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded"
          >
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-24 mt-2" />
            <Skeleton className="h-5 w-16 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[146px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="text-red-500 text-center text-sm">
          Failed to fetch stats
        </p>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="flex justify-center items-center h-[146px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="text-muted-foreground text-center">No stats data</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-4 grid-cols-2 grid-flow-row">
      <Card className="rounded gap-0 px-1">
        <CardHeader>
          <CardTitle>Visitors</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-4xl font-semibold">
            {abbreviateNumber(statsData.total_visitors)}
          </p>
          <ChangePercentage
            current={statsData.total_visitors}
            previous={statsData.prev_total_visitors}
          />
        </CardContent>
      </Card>
      {/*  */}
      <Card className="rounded gap-0 px-1">
        <CardHeader>
          <CardTitle>Visits</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-4xl font-semibold">
            {abbreviateNumber(statsData.total_visits)}
          </p>
          <ChangePercentage
            current={statsData.total_visits}
            previous={statsData.prev_total_visits}
          />
        </CardContent>
      </Card>
      {/*  */}
      <Card className="rounded gap-0 px-1">
        <CardHeader>
          <CardTitle>Views</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-4xl font-semibold">
            {abbreviateNumber(statsData.total_views)}
          </p>
          <ChangePercentage
            current={statsData.total_views}
            previous={statsData.prev_total_views}
          />
        </CardContent>
      </Card>
      {/*  */}
      <Card className="rounded gap-0 px-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            Visit Duration
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-3" color="gray" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Average duration of a visit</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-4xl font-semibold">
            {formatTime(statsData.avg_visit_duration)}
          </p>
          <ChangePercentage
            current={statsData.avg_visit_duration}
            previous={statsData.prev_avg_visit_duration}
          />
        </CardContent>
      </Card>
    </div>
  );
}
