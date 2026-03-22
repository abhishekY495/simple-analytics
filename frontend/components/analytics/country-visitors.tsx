import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaximizeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { abbreviateNumber } from "@/utils/abbreviate-number";
import { Button } from "../ui/button";
import MoreCountryVisitorsDialog from "./more-dialogs/more-country-visitors-dialog";
import ReactCountryFlag from "react-country-flag";
import { getAnalytics } from "@/services/analytics-service";
import { getPublicAnalytics } from "@/services/public-analytics-service";

export default function CountryVisitors({
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
    data: countryVisitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countryVisitors", websiteId, start, end],
    queryFn: () =>
      accessToken
        ? getAnalytics({
            websiteId,
            start,
            end,
            accessToken,
            limit: 10,
            type: "country",
          })
        : getPublicAnalytics({
            websiteId,
            start,
            end,
            limit: 10,
            type: "country",
          }),
  });

  const countryVisitorsData = countryVisitors?.data ?? [];
  const totalVisitors = countryVisitorsData.reduce(
    (sum, p) => sum + p.visitors,
    0,
  );
  const countryVisitorsDataRows = countryVisitorsData.map((p) => ({
    country: p.country,
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
        <p className="text-red-500">Failed to load country visitors</p>
      </div>
    );
  } else if (countryVisitorsData.length === 0) {
    cardContent = (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No country visitors data</p>
      </div>
    );
  } else {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    cardContent = (
      <>
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Country</p>
          <p className="text-sm font-semibold w-[65px] text-center mr-2">
            Visitors
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          {countryVisitorsDataRows.map((row) => (
            <div
              key={row.country}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50"
            >
              <ReactCountryFlag
                countryCode={row.country}
                className="text-lg"
                svg
              />
              <p className="text-sm text-neutral-800 dark:text-neutral-300 truncate flex-1 min-w-0">
                {regionNames.of(row.country)}
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
      </>
    );
  }

  return (
    <Card className="rounded px-2 gap-3">
      <CardHeader>
        <CardTitle className="text-xl border-b pb-4">Location</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 h-[420px]">
        {cardContent}
      </CardContent>

      <MoreCountryVisitorsDialog
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
