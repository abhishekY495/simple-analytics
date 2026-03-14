import { getTrackingCodeSnippet } from "@/utils/get-tracking-code-snippet";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export function TrackingCode({ id }: { id: string }) {
  const trackingCode = getTrackingCodeSnippet(id);

  const handleCopyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    toast.success("Tracking code copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <p className="font-semibold">Tracking code</p>
        <p className="text-sm text-muted-foreground">
          To track stats for this website, place the following code in the{" "}
          &lt;head&gt;...&lt;/head&gt; section of your HTML
        </p>
      </div>

      <div className="relative">
        <textarea
          value={trackingCode}
          disabled
          className="w-full h-fit min-h-20 border rounded px-3 py-1.5 text-sm bg-muted resize-none text-muted-foreground"
        />
        <CopyIcon
          size={16}
          className="cursor-pointer absolute right-3 top-3"
          onClick={handleCopyTrackingCode}
        />
      </div>
    </div>
  );
}
