import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import ReactCountryFlag from "react-country-flag";
import { getAnalytics } from "@/services/analytics-service";

export default function MoreCountryVisitorsDialog({
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
    data: countryVisitorsMore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countryVisitorsMore", websiteId, start, end],
    queryFn: () =>
      getAnalytics({
        websiteId,
        start,
        end,
        accessToken,
        limit: 500,
        type: "country",
      }),
    enabled: open,
  });

  const countryVisitorsMoreData = countryVisitorsMore?.data ?? [];

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
          Failed to load country visitors
        </p>
      </div>
    );
  } else if (countryVisitorsMoreData.length === 0) {
    dialogBody = (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No country visitors data
        </p>
      </div>
    );
  } else {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    dialogBody = (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Country</p>
          <p className="text-sm font-semibold text-center">Visitors</p>
        </div>
        <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-auto pr-2 minimal-scrollbar">
          {countryVisitorsMoreData.map((row) => (
            <div
              key={row.country}
              className="flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={row.country}
                  className="text-lg"
                  svg
                />
                <p className="text-sm text-neutral-800 dark:text-neutral-300">
                  {regionNames.of(row.country)}
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
          <DialogTitle className="text-xl border-b pb-4">Location</DialogTitle>
        </DialogHeader>
        {dialogBody}
      </DialogContent>
    </Dialog>
  );
}
