import {
  AddWebsiteRequest,
  AddWebsiteResponse,
  GetWebsitesRequest,
  GetWebsitesResponse,
} from "@/types/website";

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

export async function getWebsites(
  req: GetWebsitesRequest,
): Promise<GetWebsitesResponse> {
  const res = await fetch(`/api/websites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
  });
  return res.json();
}
