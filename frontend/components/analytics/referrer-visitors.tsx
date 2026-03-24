import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { ExternalLinkIcon, MaximizeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MoreReferrerVisitorsDialog from "./more-dialogs/more-referrer-visitors-dialog";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import ImageWithFallback from "../image-with-fallback";
import Link from "next/link";
import { getAnalytics } from "@/services/analytics-service";
import { getPublicAnalytics } from "@/services/public-analytics-service";

export default function ReferrerVisitors({
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
    data: referrerVisitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["referrerVisitors", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getAnalytics({
            websiteId,
            start,
            end,
            accessToken,
            limit: 11,
            type: "referrer",
          })
        : getPublicAnalytics({
            websiteId,
            start,
            end,
            limit: 11,
            type: "referrer",
          }),
  });

  const referrerVisitorsData = referrerVisitors?.data ?? [];
  const filteredReferrerVisitorsData = referrerVisitorsData?.filter(
    (p) => p.referrer !== "self",
  );

  const totalVisitors = filteredReferrerVisitorsData.reduce(
    (sum, p) => sum + p.visitors,
    0,
  );
  const referrerVisitorsDataRows = filteredReferrerVisitorsData
    .slice(0, 10)
    .map((p) => ({
      referrer: p.referrer,
      visitors: p.visitors,
      percentage:
        totalVisitors > 0 ? Math.round((p.visitors / totalVisitors) * 100) : 0,
    }));

  let cardContent: ReactNode;
  if (isLoading) {
    cardContent = <Skeleton className="size-full" />;
  } else if (error) {
    cardContent = (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load referrer visitors</p>
      </div>
    );
  } else if (filteredReferrerVisitorsData.length === 0) {
    cardContent = (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No referrer visitors data</p>
      </div>
    );
  } else {
    cardContent = (
      <>
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Referrer</p>
          <p className="text-sm font-semibold w-[65px] text-center mr-2">
            Visitors
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          {referrerVisitorsDataRows.map((row) => (
            <Link
              href={`https://${row.referrer}`}
              target="_blank"
              key={row.referrer}
              className="group flex justify-between items-center px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={getWebsiteIcon(row.referrer)}
                  fallbackSrc="/fallback-icon.png"
                  alt={row.referrer}
                  width={16}
                  height={16}
                  className="object-cover aspect-square"
                />
                <p className=" text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0 flex items-center gap-1">
                  {row.referrer}
                  <ExternalLinkIcon
                    size={12}
                    className="text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
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
            </Link>
          ))}
          <Button
            variant="ghost"
            className="mt-2 rounded cursor-pointer"
            onClick={() => setIsMoreOpen(true)}
          >
            <MaximizeIcon size={16} /> More
          </Button>
        </div>
      </>
    );
  }

  return (
    <Card className="rounded px-2 gap-3">
      <CardHeader>
        <CardTitle className="text-xl border-b pb-4">Sources</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 h-[420px]">
        {cardContent}
      </CardContent>

      <MoreReferrerVisitorsDialog
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
