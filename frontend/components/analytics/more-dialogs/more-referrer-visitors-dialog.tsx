import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReferrerVisitors } from "@/services/analytics-service";
import { Skeleton } from "../../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import ImageWithFallback from "@/components/image-with-fallback";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import { FALLBACK_ICON_URL } from "@/utils/constants";

export default function MoreReferrerVisitorsDialog({
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
    data: referrerVisitorsMore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["referrerVisitorsMore", websiteId, start, end],
    queryFn: () =>
      getReferrerVisitors({
        websiteId,
        start,
        end,
        accessToken,
        limit: 500,
      }),
    enabled: open,
  });

  const referrerVisitorsMoreData = referrerVisitorsMore?.data ?? [];
  const filteredReferrerVisitorsMoreData = referrerVisitorsMoreData.filter(
    (p) => p.referrer !== "self",
  );

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
          Failed to load referrer visitors
        </p>
      </div>
    );
  } else if (filteredReferrerVisitorsMoreData.length === 0) {
    dialogBody = (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No referrer visitors data
        </p>
      </div>
    );
  } else {
    dialogBody = (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Referrer</p>
          <p className="text-sm font-semibold text-center">Visitors</p>
        </div>
        <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-auto pr-2 minimal-scrollbar">
          {filteredReferrerVisitorsMoreData.map((row) => (
            <div
              key={row.referrer}
              className="flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={getWebsiteIcon(row.referrer)}
                  fallbackSrc={`${FALLBACK_ICON_URL}/${row.referrer}`}
                  alt={row.referrer}
                  width={16}
                  height={16}
                  className="object-cover aspect-square"
                />
                <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                  {row.referrer}
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
          <DialogTitle className="text-xl border-b pb-4">
            Referrer Visitors
          </DialogTitle>
        </DialogHeader>
        {dialogBody}
      </DialogContent>
    </Dialog>
  );
}
