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
import ImageWithFallback from "@/components/image-with-fallback";
import { getBrowserIcon } from "@/utils/get-browser-icon";
import { getPublicAnalytics } from "@/services/public-analytics-service";

export default function BrowserVisitorDialog({
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
  accessToken?: string;
}) {
  const {
    data: browserVisitorsMore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["browserVisitorsMore", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getAnalytics({
            websiteId,
            start,
            end,
            accessToken,
            limit: 500,
            type: "browser",
          })
        : getPublicAnalytics({
            websiteId,
            start,
            end,
            limit: 500,
            type: "browser",
          }),
    enabled: open,
  });

  const browserVisitorsMoreData = browserVisitorsMore?.data ?? [];

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
          Failed to load browser visitors
        </p>
      </div>
    );
  } else if (browserVisitorsMoreData.length === 0) {
    dialogBody = (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No browser visitors data
        </p>
      </div>
    );
  } else {
    dialogBody = (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Browser</p>
          <p className="text-sm font-semibold text-center">Visitors</p>
        </div>
        <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-auto pr-2 minimal-scrollbar">
          {browserVisitorsMoreData.map((row) => (
            <div
              key={row.browser}
              className="flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={getBrowserIcon(row.browser)}
                  fallbackSrc="/fallback-icon.png"
                  alt={row.browser}
                  width={16}
                  height={16}
                  className="object-cover aspect-square"
                />
                <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                  {row.browser}
                </p>
              </div>
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
          <DialogTitle className="text-xl border-b pb-4">Browser</DialogTitle>
        </DialogHeader>
        {dialogBody}
      </DialogContent>
    </Dialog>
  );
}
