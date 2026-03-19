import { BROWSER_ICONS } from "./constants";

export const getBrowserIcon = (browser: string) => {
  browser = browser.toLowerCase();

  const matchedBrowser = BROWSER_ICONS.find(({ name }) =>
    name.some((browserName) => browser.includes(browserName)),
  );

  return matchedBrowser?.path ?? "/fallback-icon.png";
};
