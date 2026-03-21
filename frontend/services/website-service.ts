import {
  AddWebsiteRequest,
  AddWebsiteResponse,
  DeleteWebsiteRequest,
  DeleteWebsiteResponse,
  GetWebsiteByIdRequest,
  GetWebsiteByIdResponse,
  GetWebsitesRequest,
  GetWebsitesResponse,
  UpdateWebsiteDetailsRequest,
  UpdateWebsiteDetailsResponse,
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

export async function getWebsiteById(
  req: GetWebsiteByIdRequest,
): Promise<GetWebsiteByIdResponse> {
  const res = await fetch(`/api/websites/${req.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
  });
  return res.json();
}

export async function updateWebsiteDetails(
  req: UpdateWebsiteDetailsRequest,
): Promise<UpdateWebsiteDetailsResponse> {
  const res = await fetch(`/api/websites/${req.id}?type=${req.type}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
    body: JSON.stringify(req),
  });
  return res.json();
}

export async function deleteWebsite(
  req: DeleteWebsiteRequest,
): Promise<DeleteWebsiteResponse> {
  const res = await fetch(`/api/websites/${req.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
  });
  return res.json();
}
