"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWebsiteById } from "@/services/website-service";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from "lucide-react";
import { EditWebsiteDialog } from "@/components/website/edit-website-dialog";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import Metrics from "@/components/analytics/metrics";
import { ALL_TIME_START_DATE, DATE_FILTERS } from "@/utils/constants";
import VisitorsViewsBarChart from "@/components/analytics/visitors-views-bar-chart";
import PageVisitors from "@/components/analytics/page-visitors";

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("today");
  const [offset, setOffset] = useState(0);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    setOffset(0);
  };

  const isAllTime = selectedRange === "all time";
  const isRightDisabled = isAllTime || offset === 0;
  const isLeftDisabled = isAllTime;

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: () => getWebsiteById({ id, accessToken: accessToken! }),
  });

  const websiteData = website?.data;

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    const startOfTomorrow = new Date(now);
    startOfTomorrow.setHours(0, 0, 0, 0);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    switch (selectedRange) {
      case "today": {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() + offset);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        break;
      }
      case "last 24 hours": {
        end = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        break;
      }
      case "this week": {
        const day = now.getDay();
        const thisSunday = new Date(now);
        thisSunday.setHours(0, 0, 0, 0);
        thisSunday.setDate(thisSunday.getDate() - day);
        start = new Date(thisSunday);
        start.setDate(start.getDate() + offset * 7);
        end = offset === 0 ? startOfTomorrow : new Date(start);
        if (offset !== 0) end.setDate(end.getDate() + 7);
        break;
      }
      case "this month": {
        start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        end =
          offset === 0
            ? startOfTomorrow
            : new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
        break;
      }
      case "last 3 months": {
        end = new Date(now);
        end.setMonth(end.getMonth() + offset * 3);
        start = new Date(end);
        start.setMonth(start.getMonth() - 3);
        break;
      }
      case "last 6 months": {
        end = new Date(now);
        end.setMonth(end.getMonth() + offset * 6);
        start = new Date(end);
        start.setMonth(start.getMonth() - 6);
        break;
      }
      case "this year": {
        start = new Date(now.getFullYear() + offset, 0, 1);
        end =
          offset === 0
            ? startOfTomorrow
            : new Date(now.getFullYear() + offset + 1, 0, 1);
        break;
      }
      case "all time": {
        start = ALL_TIME_START_DATE;
        break;
      }
      default: {
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [selectedRange, offset]);

  useEffect(() => {
    if (!isLoading && !websiteData) {
      router.replace("/account/websites");
    }
  }, [isLoading, websiteData, router]);

  if (!accessToken) {
    return redirect("/");
  }

  return (
    <div className="mb-56">
      {isLoading ? (
        <div className="text-muted-foreground flex justify-center mt-12">
          <Spinner className="size-6" />
        </div>
      ) : (
        <>
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
              <EditIcon size={18} />
              Edit
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Metrics</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    className="rounded px-6 cursor-pointer"
                    disabled={isLeftDisabled}
                    onClick={() => setOffset((prev) => prev - 1)}
                  >
                    <ChevronLeftIcon size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded px-6 cursor-pointer"
                    disabled={isRightDisabled}
                    onClick={() => setOffset((prev) => prev + 1)}
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
                  <SelectContent position="popper">
                    <SelectGroup className="rounded">
                      {DATE_FILTERS.map((filter) => (
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
              startDate={startDate}
              endDate={endDate}
              accessToken={accessToken}
            />

            <VisitorsViewsBarChart
              websiteId={id}
              startDate={startDate}
              endDate={endDate}
              accessToken={accessToken}
              selectedRange={selectedRange}
            />

            <div className="grid grid-cols-2 gap-4">
              <PageVisitors
                websiteId={id}
                startDate={startDate}
                endDate={endDate}
                accessToken={accessToken}
              />
            </div>
          </div>

          {websiteData && (
            <EditWebsiteDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              website={websiteData}
            />
          )}
        </>
      )}
    </div>
  );
}
