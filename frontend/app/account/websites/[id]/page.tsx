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
import { EditIcon } from "lucide-react";
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

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Period>("today");

  const handleRangeChange = (value: Period) => setSelectedRange(value);
  const { start, end } = getDateRange(selectedRange);

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
              <p className="text-xl font-semibold">Metrics</p>
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

            <Metrics
              websiteId={id}
              start={start}
              end={end}
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
    </div>
  );
}
