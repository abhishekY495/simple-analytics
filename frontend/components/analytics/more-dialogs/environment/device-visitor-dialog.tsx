import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAnalytics } from "@/services/analytics-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeviceVisitorDialog({
  open,
  onOpenChange,
  websiteId,
  start,
  end,
  accessToken,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
}) {
  const {
    data: deviceVisitorsMore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deviceVisitorsMore", websiteId, start, end],
    queryFn: () =>
      getAnalytics({
        websiteId,
        start,
        end,
        accessToken,
        limit: 500,
        type: "device",
      }),
    enabled: open,
  });

  const deviceVisitorsMoreData = deviceVisitorsMore?.data ?? [];

  if (!open) {
    return null;
  }

  let dialogBody: ReactNode;
  if (isLoading) {
    dialogBody = (
      <div className="h-[60vh] w-full">
        <Skeleton className="size-full" />
      </div>
    );
  } else if (error) {
    dialogBody = (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-red-500 text-center">
          Failed to load device visitors
        </p>
      </div>
    );
  } else if (deviceVisitorsMoreData.length === 0) {
    dialogBody = (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No device visitors data
        </p>
      </div>
    );
  } else {
    dialogBody = (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Device</p>
          <p className="text-sm font-semibold text-center">Visitors</p>
        </div>
        <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-auto pr-2 minimal-scrollbar">
          {deviceVisitorsMoreData.map((row) => (
            <div
              key={row.device}
              className="flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
            >
              <p className="text-sm text-neutral-800 dark:text-neutral-300">
                {row.device}
              </p>
              <p className="font-semibold">{abbreviateNumber(row.visitors)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded">
        <DialogHeader>
          <DialogTitle className="text-xl border-b pb-4">Device</DialogTitle>
        </DialogHeader>
        {dialogBody}
      </DialogContent>
    </Dialog>
  );
}
