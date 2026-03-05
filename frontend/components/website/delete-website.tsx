"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { DeleteWebsiteDialog } from "./delete-website-dialog";

type DeleteWebsiteProps = {
  websiteId: string;
  onEditOpenChange: (open: boolean) => void;
};

export function DeleteWebsite({ websiteId, onEditOpenChange }: DeleteWebsiteProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <p className="font-semibold">Delete website</p>
          <p className="text-sm text-muted-foreground">
            Delete this website and all associated data. This action cannot be
            undone.
          </p>
        </div>
        <Button
          variant="destructive"
          className="rounded cursor-pointer px-6"
          onClick={() => setDeleteOpen(true)}
        >
          Delete
        </Button>
      </div>

      <DeleteWebsiteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        websiteId={websiteId}
        onEditOpenChange={onEditOpenChange}
      />
    </>
  );
}
