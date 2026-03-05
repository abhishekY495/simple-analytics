import { AccountDetails } from "@/components/settings/account-details";

export default function Settings() {
  return (
    <div className="mt-1">
      <div className="flex justify-between items-end border-b pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="mt-12">
        <div className="border rounded overflow-hidden p-5 px-8 mt-10 bg-neutral-50/20 dark:bg-neutral-900">
          <AccountDetails />
        </div>
      </div>
    </div>
  );
}
