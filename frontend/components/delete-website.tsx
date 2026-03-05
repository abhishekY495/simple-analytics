import { Button } from "./ui/button";

export function DeleteWebsite() {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex flex-col">
        <p className="font-semibold">Delete website</p>
        <p className="text-sm text-muted-foreground">
          Delete this website and all associated data. This action cannot be
          undone.
        </p>
      </div>
      <Button variant="destructive" className="rounded cursor-pointer px-6">
        Delete
      </Button>
    </div>
  );
}
