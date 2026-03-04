import { AddWebsiteRequest, AddWebsiteResponse } from "@/types/website";

export async function addWebsite(
  req: AddWebsiteRequest,
): Promise<AddWebsiteResponse> {
  const res = await fetch(`/api/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  return res.json();
}
