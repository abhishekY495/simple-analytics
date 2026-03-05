"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getWebsiteById } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { ICON_BASE_URL } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

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
    <div className="mt-2">
      {isLoading ? (
        <div className="text-muted-foreground flex justify-center mt-12">
          <Spinner className="size-6" />
        </div>
      ) : (
        <div className="flex items-center gap-2 border-b pb-4">
          <Image
            src={`${ICON_BASE_URL}/${websiteData?.domain}/icon`}
            alt={websiteData?.name ?? "Website"}
            width={22}
            height={22}
            className="rounded object-cover aspect-square mt-1"
            priority
          />
          <h1 className="text-2xl font-bold -mb-1">{websiteData?.name}</h1>
        </div>
      )}
    </div>
  );
}
