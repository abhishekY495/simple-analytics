"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addWebsite } from "@/services/websiteService";
import { useAuthStore } from "@/store/authStore";
import { validateDomain } from "@/utils/validateDomain";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Websites() {
  const [nameValue, setNameValue] = useState("");
  const [domainValue, setDomainValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit called");
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateDomain(domainValue)) {
      setError("Invalid domain");
      setLoading(false);
      return;
    }

    try {
      const data = await addWebsite({
        name: nameValue,
        domain: domainValue,
        accessToken: accessToken,
      });
      if (data.status === "error" || !data.data) {
        setError(data.status_message);
        return;
      }
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding the website");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Websites</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-md rounded px-5 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white">
              +&nbsp;&nbsp;Add website
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm rounded">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add Website
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="My website"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  required
                  className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="domain" className="text-sm font-medium">
                  Domain
                </label>
                <input
                  id="domain"
                  type="text"
                  placeholder="mywebsite.com"
                  value={domainValue}
                  onChange={(e) => setDomainValue(e.target.value)}
                  required
                  className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="rounded cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={loading}
                  type="submit"
                  className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {loading ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
