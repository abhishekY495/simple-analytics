"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getWebsiteById } from "@/services/website-service";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from "lucide-react";
import { EditWebsiteDialog } from "@/components/website/edit-website-dialog";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import Metrics from "@/components/analytics/metrics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_RANGE_FILTERS } from "@/utils/constants";
import { getDateRange } from "@/utils/get-date-range";
import { Period } from "@/types/date-range";
import VisitorsViewsBarChart from "@/components/analytics/visitors-views-bar-chart";
import { formatDate } from "@/utils/format-date";
import PageVisitors from "@/components/analytics/page-visitors";
import ReferrerVisitors from "@/components/analytics/referrer-visitors";

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Period>("today");
  const [rangeOffset, setRangeOffset] = useState(0);

  const handleRangeChange = (value: Period) => {
    setSelectedRange(value);
    setRangeOffset(0);
  };

  const { start, end } = getDateRange(selectedRange, rangeOffset);

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: () => getWebsiteById({ id, accessToken: accessToken! }),
  });

  const websiteData = website?.data;

  useEffect(() => {
    if (!isLoading && !websiteData) {
      router.replace("/account/websites");
    }
  }, [isLoading, websiteData, router]);

  if (!accessToken) {
    return redirect("/");
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center mt-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!websiteData) {
    return redirect("/account/websites");
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
    <div className="mb-56">
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
        <Button
          variant="default"
          className="rounded cursor-pointer flex items-center gap-2 w-26"
          onClick={() => setEditOpen(true)}
        >
          <SettingsIcon size={18} />
          Settings
        </Button>
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

        <Metrics
          websiteId={id}
          start={start}
          end={end}
          accessToken={accessToken}
        />

        <VisitorsViewsBarChart
          websiteId={id}
          start={start}
          end={end}
          accessToken={accessToken}
          period={selectedRange}
        />

        <div className="grid grid-cols-2 gap-4">
          <PageVisitors
            websiteId={id}
            start={start}
            end={end}
            accessToken={accessToken}
          />

          <ReferrerVisitors
            websiteId={id}
            start={start}
            end={end}
            accessToken={accessToken}
          />
        </div>
      </div>

      <EditWebsiteDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        website={websiteData}
      />
    </div>
  );
}
