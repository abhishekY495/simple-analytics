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
import { Button } from "@/components/ui/button";
import { Edit2Icon, EditIcon, PencilIcon } from "lucide-react";

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
    <>
      {isLoading ? (
        <div className="text-muted-foreground flex justify-center mt-12">
          <Spinner className="size-6" />
        </div>
      ) : (
        <div className="flex justify-between items-end border-b pb-4">
          <div className="flex items-center gap-2">
            <Image
              src={`${ICON_BASE_URL}/${websiteData?.domain}/icon`}
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
          >
            <EditIcon size={18} />
            Edit
          </Button>
        </div>
      )}
    </>
  );
}
