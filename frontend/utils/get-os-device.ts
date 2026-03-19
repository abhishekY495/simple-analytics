import { OS_ICONS } from "./constants";

export const getOsIcon = (os: string) => {
  os = os.toLowerCase();

  const matchedOs = OS_ICONS.find(({ name }) =>
    name.some((osName) => os.includes(osName)),
  );

  return matchedOs?.path ?? "/fallback-icon.png";
};
