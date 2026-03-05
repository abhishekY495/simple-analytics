import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ICON_BASE_URL } from "@/utils/constants";
import Image from "next/image";
import { TrackingCode } from "../tracking-code";
import { DeleteWebsite } from "./delete-website";
import { EditWebsiteForm } from "./edit-website-form";

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
            <EditWebsiteForm website={website} onOpenChange={onOpenChange} />
          </div>

          {/* Tracking code */}
          <div className="p-4 px-6 rounded border">
            <TrackingCode id={website.id} />
          </div>

          {/* Delete website */}
          <div className="p-4 px-6 rounded border">
            <DeleteWebsite websiteId={website.id} onEditOpenChange={onOpenChange} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
