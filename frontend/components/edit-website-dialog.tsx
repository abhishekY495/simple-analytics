"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateWebsite } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { ICON_BASE_URL } from "@/utils/constants";
import { getTrackingCodeSnippet } from "@/utils/getTrackingCodeSnippet";
import { validateDomain } from "@/utils/validateDomain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { TrackingCode } from "./tracking-code";
import { DeleteWebsite } from "./delete-website";

type EditWebsiteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: {
    id: string;
    name: string;
    domain: string;
  };
};

export function EditWebsiteDialog({
  open,
  onOpenChange,
  website,
}: EditWebsiteDialogProps) {
  const [nameValue, setNameValue] = useState(website.name);
  const [domainValue, setDomainValue] = useState(website.domain);
  const [validationError, setValidationError] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const { mutate: submitUpdate, isPending } = useMutation({
    mutationFn: () =>
      updateWebsite({
        id: website.id,
        name: nameValue,
        domain: domainValue,
        accessToken: accessToken!,
      }),
    onSuccess: (data) => {
      if (data.status === "error") {
        setValidationError(data.status_message);
        return;
      }
      // onOpenChange(false);Google
      toast.success("Website updated successfully");
      queryClient.invalidateQueries({ queryKey: ["website", website.id] });
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: () => {
      setValidationError("An error occurred while updating the website");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (nameValue.trim().length < 1) {
      setValidationError("Name is required");
      return;
    }

    if (
      domainValue.startsWith("-") ||
      domainValue.endsWith("-") ||
      domainValue.startsWith("http") ||
      domainValue.startsWith("https") ||
      domainValue.startsWith("www")
    ) {
      setValidationError("Invalid domain. Do not include http/https/www");
      return;
    }

    if (!validateDomain(domainValue)) {
      setValidationError("Invalid domain. Must be a valid domain");
      return;
    }

    submitUpdate();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(website.id);
    toast.success("ID copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl rounded mx-auto max-h-[80vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Image
              src={`${ICON_BASE_URL}/${website.domain}/icon`}
              alt={website.name}
              width={22}
              height={22}
              className="rounded object-cover aspect-square"
              priority
            />
            <p className="text-xl font-semibold">{website.name}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Edit website form */}
          <div className="p-4 px-6 rounded border">
            <form
              key={String(open)}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="id" className="text-sm font-semibold">
                  ID
                </label>
                <div className="relative">
                  <input
                    id="id"
                    type="text"
                    placeholder="My website"
                    value={website.id}
                    disabled
                    className="w-full border rounded px-3 h-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring bg-muted"
                  />
                  <CopyIcon
                    size={16}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleCopyId}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-name" className="text-sm font-semibold">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  placeholder="My website"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  required
                  className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-domain" className="text-sm font-semibold">
                  Domain
                </label>
                <input
                  id="edit-domain"
                  type="text"
                  placeholder="mywebsite.com"
                  value={domainValue}
                  onChange={(e) => setDomainValue(e.target.value)}
                  required
                  className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="rounded cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={isPending}
                  type="submit"
                  className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </div>

          {/* Tracking code */}
          <div className="p-4 px-6 rounded border">
            <TrackingCode id={website.id} />
          </div>

          {/* Delete website */}
          <div className="p-4 px-6 rounded border">
            <DeleteWebsite />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
