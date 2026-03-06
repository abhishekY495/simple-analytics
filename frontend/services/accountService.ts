import { UpdateFullNameRequest, UpdateFullNameResponse } from "@/types/account";

export async function updateFullName(
  req: UpdateFullNameRequest,
): Promise<UpdateFullNameResponse> {
  const res = await fetch(`/api/account/full-name`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
    body: JSON.stringify({ full_name: req.full_name }),
  });

  return res.json();
}
