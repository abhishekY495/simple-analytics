"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/services/accountService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const [deleteValue, setDeleteValue] = useState("");
  const [error, setError] = useState("");

  const { mutate: submitDelete, isPending } = useMutation({
    mutationFn: () =>
      deleteAccount({ accessToken: accessToken!, delete: deleteValue }),
    onSuccess: (data) => {
      if (data.status === "error") {
        setError(data.status_message ?? "Failed to delete account");
        return;
      }
      fetch("/api/auth/logout", { method: "POST" }).finally(() => {
        clearAuth();
        router.replace("/");
      });
    },
    onError: () => {
      setError("An error occurred while deleting the account");
    },
  });

  function handleClose() {
    setDeleteValue("");
    onOpenChange(false);
  }

  function handleDelete() {
    if (deleteValue !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }
    submitDelete();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete account
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Type <span className="font-semibold text-foreground">DELETE</span> in
          the box below to confirm.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="flex flex-col gap-4 mt-1"
        >
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-sm font-medium">Confirm</label>
            <Input
              placeholder="Type DELETE to confirm"
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
              disabled={isPending}
              className="rounded"
              required
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded cursor-pointer"
              type="submit"
              onClick={() => handleDelete()}
              disabled={isPending || deleteValue !== "DELETE"}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
