import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DottedMap } from "../ui/dotted-map";
import type { TCountryCode } from "countries-list";
import countryInfo from "country-js";
import { getLiveVisitors } from "@/services/analytics-service";
import { LiveVisitorMarker } from "@/types/analytics";
import { LiveVisitorMarkerOverlay } from "./live-visitor-marker-overlay";
import {
  LIVE_VISITORS_REFETCH_INTERVAL,
  MARKER_COLOR_DARK,
  MARKER_COLOR_LIGHT,
} from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";
import { getPublicLiveVisitors } from "@/services/public-analytics-service";

export default function LiveVisitors({
  websiteId,
  accessToken,
}: {
  websiteId: string;
  accessToken?: string;
}) {
  const { resolvedTheme } = useTheme();
  const { data: liveVisitors, isLoading } = useQuery({
    queryKey: ["liveVisitors", websiteId],
    queryFn: () =>
      accessToken
        ? getLiveVisitors({ websiteId, accessToken })
        : getPublicLiveVisitors({ websiteId }),
    refetchInterval: LIVE_VISITORS_REFETCH_INTERVAL,
  });

  const liveVisitorsData = liveVisitors?.data ?? [];

  const markers: LiveVisitorMarker[] = liveVisitorsData.flatMap((visitor) => {
    const country = countryInfo.getByCode(visitor.country as TCountryCode);
    if (!country) return [];

    return [
      {
        lat: country.geo.latitude ?? 0,
        lng: country.geo.longitude ?? 0,
        size: 1.6,
        overlay: {
          countryCode:
            visitor.country.toLowerCase() as LiveVisitorMarker["overlay"]["countryCode"],
          label: `${country.name.toLowerCase()} - ${visitor.visitors}`,
        },
      },
    ];
  });

  const liveVisitorsCount = liveVisitorsData.reduce(
    (acc, visitor) => acc + visitor.visitors,
    0,
  );

  return (
    <Card className="rounded px-2 gap-4">
      <CardHeader>
        <CardTitle className="text-xl border-b pb-4">
          {isLoading ? (
            <Skeleton className="w-28 h-7 rounded" />
          ) : (
            <>
              {liveVisitorsCount === 0
                ? "0 Live visitors"
                : `${liveVisitorsCount} Live ${liveVisitorsCount > 1 ? "visitors" : "visitor"}`}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DottedMap
          mapSamples={5000}
          dotRadius={0.3}
          dotColor="currentColor"
          className="text-neutral-300 dark:text-neutral-600"
          markerColor={
            resolvedTheme === "dark" ? MARKER_COLOR_DARK : MARKER_COLOR_LIGHT
          }
          markers={markers}
          pulse={true}
          renderMarkerOverlay={({ marker, x, y, r }) => {
            return (
              <LiveVisitorMarkerOverlay marker={marker} x={x} y={y} r={r} />
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
