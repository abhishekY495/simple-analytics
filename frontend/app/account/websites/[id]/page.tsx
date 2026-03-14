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
import { getWebsiteById } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { EditWebsiteDialog } from "@/components/website/edit-website-dialog";
import { getWebsiteIcon } from "@/utils/getWebsiteIcon";
import Metrics from "@/components/analytics/metrics";
import { DATE_FILTERS } from "@/utils/constants";

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("last 24 hours");

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: () => getWebsiteById({ id, accessToken: accessToken! }),
  });

  const websiteData = website?.data;

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);

    switch (selectedRange) {
      case "today": {
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "last 24 hours": {
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
        break;
      }
      case "this week": {
        const day = start.getDay();
        const diff = (day === 0 ? 6 : day - 1) * 24 * 60 * 60 * 1000;
        start.setHours(0, 0, 0, 0);
        start.setTime(start.getTime() - diff);
        break;
      }
      case "last 7 days": {
        start.setTime(start.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      }
      case "this month": {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "last 3 months": {
        start.setMonth(start.getMonth() - 3);
        break;
      }
      case "last 6 months": {
        start.setMonth(start.getMonth() - 6);
        break;
      }
      case "last 12 months": {
        start.setMonth(start.getMonth() - 12);
        break;
      }
      case "this year": {
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "all time": {
        start.setTime(0);
        break;
      }
      default: {
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    return {
      startDate: start.toISOString(),
      endDate: now.toISOString(),
    };
  }, [selectedRange]);

  useEffect(() => {
    if (!isLoading && !websiteData) {
      router.replace("/account/websites");
    }
  }, [isLoading, websiteData, router]);

  if (!accessToken) {
    return redirect("/");
  }

  return (
    <>
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
              <Select
                value={selectedRange}
                onValueChange={(value) => setSelectedRange(value)}
              >
                <SelectTrigger className="w-44 rounded text-[15px] font-medium">
                  <SelectValue
                    placeholder="Last 24 hours"
                    className="font-medium"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup className="rounded">
                    {DATE_FILTERS.map((filter) => (
                      <>
                        <SelectItem
                          key={filter.value}
                          className="p-1.5 px-3 rounded text-[15px]"
                          value={filter.value}
                        >
                          {filter.label}
                        </SelectItem>
                        {filter.separator && <SelectSeparator />}
                      </>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Metrics
              websiteId={id}
              startDate={startDate}
              endDate={endDate}
              accessToken={accessToken}
            />
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
    </>
  );
}
