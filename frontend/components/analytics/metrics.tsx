import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "@/services/analytics-service";
import { Skeleton } from "../ui/skeleton";
import { formatTime } from "@/utils/format-time";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ChangePercentage } from "./change-percentage";

export default function Metrics({
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
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["metrics", websiteId, startDate, endDate],
    queryFn: () => getMetrics({ websiteId, startDate, endDate, accessToken }),
  });

  const metricsData = metrics?.data;
  console.log("metricsData", metricsData);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
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
      <div className="flex justify-center items-center h-[138px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="text-red-500 text-center text-sm">
          Failed to fetch metrics <br /> Reload the page
        </p>
      </div>
    );
  }

  if (!metricsData) {
    return (
      <div className="flex justify-center items-center h-[138px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="text-muted-foreground text-center">No metrics data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="font-semibold">Visitors</p>
        <p className="text-4xl font-semibold">
          {abbreviateNumber(metricsData.visitors)}
        </p>
        <ChangePercentage
          current={metricsData.visitors}
          previous={metricsData.prev_visitors}
        />
      </div>
      <div className="flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="font-semibold">Visits</p>
        <p className="text-4xl font-semibold">
          {abbreviateNumber(metricsData.visits)}
        </p>
        <ChangePercentage
          current={metricsData.visits}
          previous={metricsData.prev_visits}
        />
      </div>
      <div className="flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="font-semibold">Views</p>
        <p className="text-4xl font-semibold">
          {abbreviateNumber(metricsData.views)}
        </p>
        <ChangePercentage
          current={metricsData.views}
          previous={metricsData.prev_views}
        />
      </div>
      <div className="flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 px-8 pb-6 rounded">
        <p className="font-semibold flex items-center gap-1">
          Visit Duration
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3" color="gray" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Average duration of a visit</p>
            </TooltipContent>
          </Tooltip>
        </p>
        <p className="text-4xl font-semibold">
          {formatTime(metricsData.avg_visit_duration_seconds)}
        </p>
        <ChangePercentage
          current={metricsData.avg_visit_duration_seconds}
          previous={metricsData.prev_avg_visit_duration_seconds}
        />
      </div>
    </div>
  );
}
