import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics-service";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { MaximizeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DeviceVisitorDialog from "../more-dialogs/environment/device-visitor-dialog";
import { getDeviceIcon } from "@/utils/get-device.icon";
import ImageWithFallback from "@/components/image-with-fallback";
import { getPublicAnalytics } from "@/services/public-analytics-service";

export default function DeviceVisitor({
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
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const {
    data: deviceVisitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deviceVisitors", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getAnalytics({
            websiteId,
            start,
            end,
            accessToken,
            limit: 10,
            type: "device",
          })
        : getPublicAnalytics({
            websiteId,
            start,
            end,
            limit: 10,
            type: "device",
          }),
  });

  const deviceVisitorsData = deviceVisitors?.data ?? [];
  const totalVisitors = deviceVisitorsData.reduce(
    (sum, p) => sum + p.visitors,
    0,
  );
  const deviceVisitorsDataRows = deviceVisitorsData.map((p) => ({
    device: p.device,
    visitors: p.visitors,
    percentage:
      totalVisitors > 0 ? Math.round((p.visitors / totalVisitors) * 100) : 0,
  }));

  if (isLoading) {
    return <Skeleton className="size-full" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load device visitors</p>
      </div>
    );
  }

  if (deviceVisitorsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No device visitors data</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold">Device</p>
        <p className="text-sm font-semibold w-[65px] text-center mr-2">
          Visitors
        </p>
      </div>
      <div className="flex flex-col gap-0.5">
        {deviceVisitorsDataRows.map((row) => (
          <div
            key={row.device}
            className="flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <ImageWithFallback
                src={getDeviceIcon(row.device)}
                fallbackSrc="/fallback-icon.png"
                alt={row.device}
                width={16}
                height={16}
                className="object-cover aspect-square"
              />
              <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                {row.device}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm shrink-0 w-[60px]">
              <span className="font-semibold">
                {abbreviateNumber(row.visitors)}
              </span>
              <span className="text-muted-foreground/80">|</span>
              <span className="text-muted-foreground/60 font-medium">
                {row.percentage}%
              </span>
            </div>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-2 rounded cursor-pointer"
          onClick={() => setIsMoreOpen(true)}
        >
          <MaximizeIcon size={16} /> More
        </Button>
      </div>
      {/*  */}
      <DeviceVisitorDialog
        open={isMoreOpen}
        onOpenChange={setIsMoreOpen}
        websiteId={websiteId}
        start={start}
        end={end}
        accessToken={accessToken}
      />
    </>
  );
}
