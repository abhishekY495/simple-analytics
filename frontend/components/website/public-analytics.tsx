import { GetWebsiteByIdResponseItem } from "@/types/website";
import { Switch } from "../ui/switch";

export function PublicAnalytics({
  website,
}: {
  website: GetWebsiteByIdResponseItem;
}) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex flex-col">
        <p className="font-semibold">Public</p>
        <p className="text-sm text-muted-foreground">
          Make the website analytics public so that anyone can view it.
        </p>
      </div>
      <Switch
        id="switch-focus-mode"
        checked={website.is_public}
        className="data-[state=checked]:bg-sky-500 cursor-pointer"
        style={{ transform: "scale(1.2)" }}
      />
    </div>
  );
}
