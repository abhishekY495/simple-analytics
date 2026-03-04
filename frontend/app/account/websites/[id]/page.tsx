"use client";

import { Spinner } from "@/components/ui/spinner";
import { getWebsiteById } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: website, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: () => getWebsiteById({ id, accessToken: accessToken! }),
  });

  if (!accessToken) {
    return redirect("/");
  }

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="text-muted-foreground flex justify-center mt-20">
          <Spinner className="size-7" />
        </div>
      ) : (
        <div className="flex justify-between items-end border-b pb-4">
          <h1 className="text-2xl font-bold -mb-1">
            {website?.data?.name ?? "Website"}
          </h1>
        </div>
      )}
    </div>
  );
}
