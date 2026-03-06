import { ICON_BASE_URL } from "./constants";

export function getWebsiteIcon(domain: string) {
  if (!domain || domain === "") {
    return `${ICON_BASE_URL}/unavatar.io.ico`;
  }
  return `${ICON_BASE_URL}/${domain}.ico`;
}
