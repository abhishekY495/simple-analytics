"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeEmail } from "@/services/account-service";
import { useAuthStore } from "@/store/auth-store";
import { validateEmail } from "@/utils/validate-email";

type ChangeEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangeEmailDialog({
  open,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: submitChangeEmail, isPending } = useMutation({
    mutationFn: () =>
      changeEmail({
        email,
        accessToken: accessToken!,
      }),
    onSuccess: (data) => {
      if (data.status === "error") {
        setError(data.status_message ?? "Failed to change email");
        return;
      }
      setAuth(accessToken, { ...user!, email });
      toast.success("Email changed successfully");
      handleClose();
    },
    onError: () => {
      setError("An error occurred while changing the email");
    },
  });

  function handleClose() {
    setEmail("");
    onOpenChange(false);
  }

  function handleSave() {
    if (!email) {
      setError("Email address is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    submitChangeEmail();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Change email
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-4 mt-1"
        >
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-sm font-medium">Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="rounded"
              required
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
              className="rounded cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
