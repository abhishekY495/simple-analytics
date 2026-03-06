"use client";

import { updateFullName } from "@/services/accountService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

export function AccountDetails() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);

  if (!user) {
    redirect("/");
  }

  const [fullNameValue, setFullNameValue] = useState(user.full_name);
  const [validationError, setValidationError] = useState("");

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    toast.success("Account ID copied to clipboard");
  };

  const { mutate: submitUpdate, isPending } = useMutation({
    mutationFn: () =>
      updateFullName({ full_name: fullNameValue, accessToken: accessToken! }),
    onSuccess: (data) => {
      if (data.status === "error") {
        setValidationError(data.status_message);
        return;
      }
      setAuth(accessToken, { ...user, full_name: fullNameValue });
      toast.success("Full name updated successfully");
    },
    onError: () => {
      setValidationError("An error occurred while updating full name");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (fullNameValue.trim().length < 1) {
      setValidationError("Full name is required");
      return;
    }

    submitUpdate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-id" className="text-sm font-semibold">
          Account ID
        </label>
        <div className="relative">
          <input
            id="account-id"
            type="text"
            value={user.id}
            disabled
            className="w-full border rounded px-3 h-9 text-sm outline-none bg-muted"
          />
          <CopyIcon
            size={16}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={handleCopyId}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-full-name" className="text-sm font-semibold">
          Full Name
        </label>
        <input
          id="account-full-name"
          type="text"
          placeholder="Your full name"
          value={fullNameValue}
          onChange={(e) => setFullNameValue(e.target.value)}
          className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="account-email"
          type="email"
          value={user.email}
          disabled
          className="w-full border rounded px-3 h-9 text-sm outline-none bg-muted"
        />
      </div>

      {validationError && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}

      <div className="flex justify-end">
        <Button
          disabled={isPending}
          type="submit"
          className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
