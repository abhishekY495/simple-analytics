"use client";

import { AddWebsiteDialog } from "@/components/add-website-dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWebsites } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { ICON_BASE_URL } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Websites() {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: websites, isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: () => getWebsites({ accessToken: accessToken! }),
  });

  if (!accessToken) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex justify-between items-end border-b pb-4">
        <h1 className="text-2xl font-bold -mb-1">Websites</h1>
        <AddWebsiteDialog />
      </div>

      <div className="mt-12">
        {isLoading ? (
          <div className="text-muted-foreground flex justify-center">
            <Spinner className="size-6" />
          </div>
        ) : websites?.data && websites.data.length > 0 ? (
          <div className="border rounded overflow-hidden p-5 px-8 mt-10">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="w-1/2 font-semibold px-4">
                    Name
                  </TableHead>
                  <TableHead className="w-1/2 font-semibold">Domain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.data.map((website) => (
                  <TableRow key={website.id} className="cursor-pointer">
                    <TableCell className="py-3.5 px-4">
                      <Link
                        href={"/account/websites/" + website.id}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={`${ICON_BASE_URL}/${website.domain}/icon`}
                          alt={website.name}
                          width={22}
                          height={22}
                          className="rounded object-cover size-5 aspect-square"
                          priority
                          sizes="22px 22px"
                        />
                        <span className="text-muted-foreground font-medium">
                          {website.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-blue-500 underline decoration-blue-500 underline-offset-3 hover:decoration-1">
                      <Link
                        href={"https://" + website.domain}
                        className="flex items-center gap-1"
                        target="_blank"
                      >
                        {website.domain}
                        <ExternalLinkIcon size={12} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center mt-10">
            No websites added yet
          </p>
        )}
      </div>
    </>
  );
}
