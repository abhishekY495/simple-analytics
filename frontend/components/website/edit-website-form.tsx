import { updateWebsite } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { validateDomain } from "@/utils/validateDomain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export function EditWebsiteForm({
  website,
  onOpenChange,
}: {
  website: { id: string; name: string; domain: string };
  onOpenChange: (open: boolean) => void;
}) {
  const [nameValue, setNameValue] = useState(website.name);
  const [domainValue, setDomainValue] = useState(website.domain);
  const [validationError, setValidationError] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const { mutate: submitUpdate, isPending } = useMutation({
    mutationFn: () =>
      updateWebsite({
        id: website.id,
        name: nameValue,
        domain: domainValue,
        accessToken: accessToken!,
      }),
    onSuccess: (data) => {
      if (data.status === "error") {
        setValidationError(data.status_message);
        return;
      }
      //   onOpenChange(false);
      toast.success("Website updated successfully");
      queryClient.invalidateQueries({ queryKey: ["website", website.id] });
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: () => {
      setValidationError("An error occurred while updating the website");
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

    submitUpdate();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(website.id);
    toast.success("ID copied to clipboard");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="id" className="text-sm font-semibold">
          ID
        </label>
        <div className="relative">
          <input
            id="id"
            type="text"
            placeholder="My website"
            value={website.id}
            disabled
            className="w-full border rounded px-3 h-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring bg-muted"
          />
          <CopyIcon
            size={16}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleCopyId}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="edit-name"
          type="text"
          placeholder="My website"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          required
          className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-domain" className="text-sm font-semibold">
          Domain
        </label>
        <input
          id="edit-domain"
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
        <Button
          disabled={isPending}
          type="submit"
          className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
