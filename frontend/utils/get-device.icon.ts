import { DEVICE_ICONS } from "./constants";

export const getDeviceIcon = (device: string) => {
  device = device.toLowerCase();

  const matchedDevice = DEVICE_ICONS.find(({ name }) =>
    name.some((deviceName) => device.includes(deviceName)),
  );

  return matchedDevice?.path ?? "/fallback-icon.png";
};
