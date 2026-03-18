import { useQuery } from "@tanstack/react-query";
import { getPageVisitors } from "@/services/analytics-service";
import { Skeleton } from "../../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export default function MorePageVisitorsDialog({
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
    data: pageVisitorsMore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pageVisitorsMore", websiteId, start, end],
    queryFn: () =>
      getPageVisitors({
        websiteId,
        start,
        end,
        accessToken,
        limit: 500,
      }),
    enabled: open,
  });

  const pageVisitorsMoreData = pageVisitorsMore?.data ?? [];

  if (isLoading) {
    return (
      <div className="h-[60vh] w-full">
        <Skeleton className="size-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-red-500 text-center">Failed to load page visitors</p>
      </div>
    );
  }

  if (pageVisitorsMoreData.length === 0) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No page visitors data
        </p>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl border-b pb-4">Pages</DialogTitle>
        </DialogHeader>
        {/*  */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Path</p>
            <p className="text-sm font-semibold w-[65px] text-center">
              Visitors
            </p>
          </div>
          <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-auto pr-2 minimal-scrollbar">
            {pageVisitorsMoreData.map((row) => (
              <div
                key={row.path}
                className="flex justify-between items-center px-2 py-1.5 -mx-2 hover:bg-muted/50"
              >
                <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                  {row.path}
                </p>
                <p className="font-semibold">
                  {abbreviateNumber(row.visitors)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
