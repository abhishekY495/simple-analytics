"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addWebsite } from "@/services/website-service";
import { useAuthStore } from "@/store/auth-store";
import { validateDomain } from "@/utils/validate-domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function AddWebsiteDialog() {
  const [open, setOpen] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [domainValue, setDomainValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const { mutate: submitAddWebsite, isPending } = useMutation({
    mutationFn: () =>
      addWebsite({
        name: nameValue,
        domain: domainValue,
        accessToken: accessToken!,
      }),
    onSuccess: (data) => {
      if (data.status === "error" || !data.data) {
        setValidationError(data.status_message);
        return;
      }
      setOpen(false);
      toast.success("Website added successfully");
      setNameValue("");
      setDomainValue("");
      setValidationError("");
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: () => {
      setValidationError("An error occurred while adding the website");
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

    submitAddWebsite();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-md rounded px-5 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white">
          +&nbsp;&nbsp;Add website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Website</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="My website"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              required
              className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain
            </label>
            <input
              id="domain"
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
              {isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
