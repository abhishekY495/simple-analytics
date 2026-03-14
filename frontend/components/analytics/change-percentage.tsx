import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateChangePercentage } from "@/utils/calculate-change-percentage";

export const ChangePercentage = ({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) => {
  const changePercentage = calculateChangePercentage(current, previous);
  const isPositive = changePercentage > 0;

  return (
    <p
      className={cn(
        "text-sm text-muted-foreground p-0.5 px-1.5 w-fit font-medium rounded inline-flex items-center gap-1 tracking-wider mt-1",
        isPositive
          ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/10"
          : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10",
      )}
    >
      {isPositive ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
      {Math.abs(changePercentage)}%
    </p>
  );
};
