import { ICON_BASE_URL } from "./constants";

export function getWebsiteIcon(domain: string) {
  if (!domain || domain === "") {
    return `${ICON_BASE_URL}/favicon.ico`;
  }
  return `${ICON_BASE_URL}/${domain}/icon`;
}
