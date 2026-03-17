import { useQuery } from "@tanstack/react-query";
import { getChartData } from "@/services/analytics-service";

export default function VisitorsViewsBarChart({
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
  const {
    data: visitorsViewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["visitorsViews", websiteId, start, end],
    queryFn: () => getChartData({ websiteId, start, end, accessToken }),
  });

  const chartData = visitorsViewsData?.data;
  console.log(chartData);

  return <div>VisitorsViewsBarChart</div>;
}
