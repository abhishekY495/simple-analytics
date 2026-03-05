"use client";

import { useAuthStore } from "@/store/authStore";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

export function AccountDetails() {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    redirect("/");
  }

  const [nameValue, setNameValue] = useState(user.full_name);

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    toast.success("Account ID copied to clipboard");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <label htmlFor="account-name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="account-name"
          type="text"
          placeholder="Your name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
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

      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
