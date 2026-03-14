"use client";

import { deleteWebsite } from "@/services/website-service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type DeleteWebsiteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  onEditOpenChange: (open: boolean) => void;
};

export function DeleteWebsiteDialog({
  open,
  onOpenChange,
  websiteId,
  onEditOpenChange,
}: DeleteWebsiteDialogProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: submitDelete, isPending } = useMutation({
    mutationFn: () =>
      deleteWebsite({ id: websiteId, accessToken: accessToken! }),
    onSuccess: (data) => {
      if (data.status === "error") {
        toast.error(data.status_message ?? "Failed to delete website");
        return;
      }
      toast.success("Website deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      onOpenChange(false);
      onEditOpenChange(false);
      router.replace("/account/websites");
    },
    onError: () => {
      toast.error("An error occurred while deleting the website");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete website
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this website? All associated data will
          be permanently removed. This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="outline"
            className="rounded cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded cursor-pointer"
            onClick={() => submitDelete()}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
