import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateFullNameRequest,
  UpdateFullNameResponse,
} from "@/types/account";

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

export async function changePassword(
  req: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const res = await fetch(`/api/account/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.accessToken}`,
    },
    body: JSON.stringify({
      current_password: req.current_password,
      new_password: req.new_password,
    }),
  });

  return res.json();
}
