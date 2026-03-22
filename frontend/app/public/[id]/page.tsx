"use client";

import CountryVisitors from "@/components/analytics/country-visitors";
import Environment from "@/components/analytics/environment";
import LiveVisitors from "@/components/analytics/live-visitors";
import PageVisitors from "@/components/analytics/page-visitors";
import ReferrerVisitors from "@/components/analytics/referrer-visitors";
import Stats from "@/components/analytics/stats";
import VisitorsViewsBarChart from "@/components/analytics/visitors-views-bar-chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getPublicWebsiteById } from "@/services/public-analytics-service";
import { Period } from "@/types/date-range";
import { DATE_RANGE_FILTERS } from "@/utils/constants";
import { formatDate } from "@/utils/format-date";
import { getDateRange } from "@/utils/get-date-range";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";

export default function PublicPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedRange, setSelectedRange] = useState<Period>("today");
  const [rangeOffset, setRangeOffset] = useState(0);

  const handleRangeChange = (value: Period) => {
    setSelectedRange(value);
    setRangeOffset(0);
  };

  const { start, end } = getDateRange(selectedRange, rangeOffset);

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: () => getPublicWebsiteById({ id }),
  });

  const websiteData = website?.data;
  const status = website?.status;

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center mt-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (status === "error") {
    return redirect("/");
  }

  if (!websiteData) {
    return redirect("/");
  }

  const isNavigable =
    selectedRange === "today" || selectedRange === "thisMonth";
  const isLeftDisabled = !isNavigable;
  const isRightDisabled = !isNavigable || rangeOffset === 0;

  const handlePrevious = () => {
    if (!isNavigable) return;

    setRangeOffset((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isNavigable || rangeOffset === 0) return;

    setRangeOffset((prev) => Math.min(prev + 1, 0));
  };

  return (
    <div className="mb-24">
      <div className="flex justify-between items-end border-b pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Image
            src={getWebsiteIcon(websiteData?.domain ?? "")}
            alt={websiteData?.name ?? "Website"}
            width={22}
            height={22}
            className="rounded object-cover aspect-square"
            priority
          />
          <h1 className="text-2xl font-bold">{websiteData?.name}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formatDate(start, end, selectedRange)}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded px-6 cursor-pointer"
                disabled={isLeftDisabled}
                onClick={handlePrevious}
              >
                <ChevronLeftIcon size={18} />
              </Button>
              <Button
                variant="outline"
                className="rounded px-6 cursor-pointer"
                disabled={isRightDisabled}
                onClick={handleNext}
              >
                <ChevronRightIcon size={18} />
              </Button>
            </div>
            <Select value={selectedRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-44 rounded text-[15px] font-medium cursor-pointer">
                <SelectValue
                  placeholder="Last 24 hours"
                  className="font-medium"
                />
              </SelectTrigger>
              <SelectContent position="popper" className="rounded">
                <SelectGroup>
                  {DATE_RANGE_FILTERS.map((filter) => (
                    <div key={filter.value}>
                      <SelectItem
                        className="p-1.5 px-3 rounded text-[15px] cursor-pointer"
                        value={filter.value}
                      >
                        {filter.label}
                      </SelectItem>
                      {filter.separator && <SelectSeparator />}
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Stats websiteId={id} start={start} end={end} />

        <VisitorsViewsBarChart
          websiteId={id}
          start={start}
          end={end}
          period={selectedRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PageVisitors websiteId={id} start={start} end={end} />
          <ReferrerVisitors websiteId={id} start={start} end={end} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Environment websiteId={id} start={start} end={end} />
          <CountryVisitors websiteId={id} start={start} end={end} />
        </div>

        <LiveVisitors websiteId={id} />
      </div>
    </div>
  );
}
