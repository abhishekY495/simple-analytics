import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { TrackingCode } from "./tracking-code";
import { DeleteWebsite } from "./delete-website";
import { EditWebsiteForm } from "./edit-website-form";
import { getWebsiteIcon } from "@/utils/get-website-icon";
import { PublicAnalytics } from "./public-analytics";
import { GetWebsiteByIdResponseItem } from "@/types/website";

type EditWebsiteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: GetWebsiteByIdResponseItem;
};

export function EditWebsiteDialog({
  open,
  onOpenChange,
  website,
}: EditWebsiteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl rounded mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Image
              src={getWebsiteIcon(website.domain)}
              alt={website.name}
              width={22}
              height={22}
              className="rounded object-cover aspect-square"
              priority
            />
            <p className="text-xl font-semibold">{website.name}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pb-2 overflow-y-auto max-h-[80vh] minimal-scrollbar">
          {/* Edit website form */}
          <div className="p-4 px-6 rounded border">
            <EditWebsiteForm website={website} onOpenChange={onOpenChange} />
          </div>

          {/* Tracking code */}
          <div className="p-4 px-6 rounded border">
            <TrackingCode id={website.id} />
          </div>

          {/* Public website */}
          <div className="p-4 px-6 rounded border border-sky-950 bg-sky-950/20">
            <PublicAnalytics website={website} />
          </div>

          {/* Delete website */}
          <div className="p-4 px-6 rounded border border-red-950 bg-red-950/20">
            <DeleteWebsite
              websiteId={website.id}
              onEditOpenChange={onOpenChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
