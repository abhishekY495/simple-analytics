import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaximizeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getPageVisitors } from "@/services/analytics-service";
import { Skeleton } from "../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { Button } from "../ui/button";
import MorePageVisitorsDialog from "./more-dialogs/more-page-visitors-dialog";

export default function PageVisitors({
  websiteId,
  start,
  end,
  accessToken,
}: {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const {
    data: pageVisitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pageVisitors", websiteId, start, end],
    queryFn: () =>
      getPageVisitors({
        websiteId,
        start,
        end,
        accessToken,
        limit: 10,
      }),
  });

  const pageVisitorsData = pageVisitors?.data ?? [];
  const totalVisitors = pageVisitorsData.reduce(
    (sum, p) => sum + p.visitors,
    0,
  );
  const pageVisitorsDataRows = pageVisitorsData.map((p) => ({
    path: p.path,
    visitors: p.visitors,
    percentage:
      totalVisitors > 0 ? Math.round((p.visitors / totalVisitors) * 100) : 0,
  }));

  if (isLoading) {
    return (
      <Card className="rounded py-8">
        <CardContent className="flex h-[470px] items-center justify-center text-muted-foreground">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded py-8">
        <CardContent className="flex h-[470px] items-center justify-center text-muted-foreground">
          <p className="text-red-500 text-center">
            Failed to load page visitors
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded pb-8 px-2 gap-3">
      <CardHeader>
        <CardTitle className="text-xl border-b pb-4">Pages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Path</p>
          <p className="text-sm font-semibold w-[65px] text-center">Visitors</p>
        </div>
        {!pageVisitorsData || pageVisitorsData.length === 0 ? (
          <p className="text-muted-foreground text-center h-[385px] flex items-center justify-center">
            No page visitors data
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {pageVisitorsDataRows.map((row) => (
              <div
                key={row.path}
                className="flex justify-between items-center px-2 py-1.5 -mx-2 hover:bg-muted/50"
              >
                <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                  {row.path}
                </p>
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
        )}
      </CardContent>

      <MorePageVisitorsDialog
        open={isMoreOpen}
        onOpenChange={setIsMoreOpen}
        websiteId={websiteId}
        start={start}
        end={end}
        accessToken={accessToken}
      />
    </Card>
  );
}
