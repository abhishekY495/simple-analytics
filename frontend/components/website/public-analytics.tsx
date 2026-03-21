import { updateWebsiteIsPublic } from "@/services/website-service";
import { GetWebsiteByIdResponseItem } from "@/types/website";
import { Switch } from "../ui/switch";
import { useAuthStore } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { getPublicAnalyticsUrl } from "@/utils/get-public-analytics-url";

export function PublicAnalytics({
  website,
}: {
  website: GetWebsiteByIdResponseItem;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isPublic, setIsPublic] = useState(website.is_public);

  const { mutate: submitUpdate, isPending } = useMutation({
    mutationFn: () =>
      updateWebsiteIsPublic({
        id: website.id,
        is_public: isPublic,
        accessToken: accessToken!,
        type: "is_public",
      }),
    onSuccess: (data) => {
      if (data.status === "error") {
        return;
      }
      setIsPublic(!isPublic);
      if (isPublic) {
        toast.success("Analytics set to private");
      } else {
        toast.success("Analytics set to public");
      }
    },
    onError: () => {
      setIsPublic(isPublic);
      toast.error("Something went wrong");
    },
  });

  const publicAnalyticsUrl = getPublicAnalyticsUrl(website.id);

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex flex-col">
        <p className="font-semibold">Public</p>
        <p className="text-sm text-muted-foreground">
          Make the website analytics public so that anyone can view it.
        </p>
        {isPublic && (
          <Link
            href={publicAnalyticsUrl}
            target="_blank"
            className="flex items-center gap-1 text-sm text-muted-foreground underline decoration-1 decoration-neutral-400 dark:decoration-neutral-600 underline-offset-4 mt-1"
          >
            {publicAnalyticsUrl}
          </Link>
        )}
      </div>
      <Switch
        id="switch-focus-mode"
        checked={isPublic}
        className="data-[state=checked]:bg-sky-500 cursor-pointer"
        style={{ transform: "scale(1.2)" }}
        onCheckedChange={() => submitUpdate()}
        disabled={isPending}
      />
    </div>
  );
}
