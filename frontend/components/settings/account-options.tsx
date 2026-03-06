import { Button } from "../ui/button";

export function AccountOptions() {
  return (
    <div className="flex flex-col gap-6">
      {/* Change password */}
      <div className="flex justify-between items-center gap-2 border-b pb-5">
        <div className="flex flex-col">
          <p className="font-semibold">Change password</p>
          <p className="text-sm text-muted-foreground">
            Change your account password.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded cursor-pointer px-6 border"
        >
          Change Password
        </Button>
      </div>

      {/* Change email */}
      <div className="flex justify-between items-center gap-2 border-b pb-5">
        <div className="flex flex-col">
          <p className="font-semibold">Change email</p>
          <p className="text-sm text-muted-foreground">
            Change your account email.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded cursor-pointer px-6 border"
        >
          Change Email
        </Button>
      </div>

      {/* Delete account */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <p className="font-semibold">Delete account</p>
          <p className="text-sm text-muted-foreground">
            Delete your account and all associated data. This action cannot be
            undone.
          </p>
        </div>
        <Button variant="destructive" className="rounded cursor-pointer px-6">
          Delete
        </Button>
      </div>
    </div>
  );
}
