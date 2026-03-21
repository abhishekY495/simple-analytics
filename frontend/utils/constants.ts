import { ChartConfig } from "@/components/ui/chart";

export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? "http://localhost:8080"
    : process.env.BACKEND_URL || "";

export const ICON_BASE_URL = "https://icons.duckduckgo.com/ip3";

export const ALL_TIME_START_DATE = new Date("2026-01-01T00:00:00.000Z");

export const LIVE_VISITORS_REFETCH_INTERVAL = 30000;

export const MARKER_COLOR_LIGHT = "#d1d1d1";
export const MARKER_COLOR_DARK = "#525252";

export const CHART_CONFIG = {
  visitors: {
    label: "Visitors",
    color: "#0072ff",
  },
  views: {
    label: "Views",
    color: "#4c9cffd4",
  },
} satisfies ChartConfig;

export const DATE_RANGE_FILTERS = [
  {
    label: "Today",
    value: "today",
    separator: false,
  },
  {
    label: "Last 24 hours",
    value: "last24hours",
    separator: true,
  },
  {
    label: "This week",
    value: "thisWeek",
    separator: false,
  },
  {
    label: "This month",
    value: "thisMonth",
    separator: true,
  },
  {
    label: "Last 3 months",
    value: "last3Months",
    separator: false,
  },
  {
    label: "Last 6 months",
    value: "last6Months",
    separator: true,
  },
  {
    label: "This year",
    value: "thisYear",
    separator: false,
  },
  {
    label: "All time",
    value: "allTime",
    separator: false,
  },
];

export const BROWSER_ICONS = [
  {
    name: ["chrome"],
    path: "/browser/chrome.png",
  },
  {
    name: ["android browser", "android"],
    path: "/browser/android.png",
  },
  {
    name: ["chromium-webview", "chromium"],
    path: "/browser/chromium-webview.png",
  },
  {
    name: ["edge-webview", "edge"],
    path: "/browser/edge-chromium.png",
  },
  {
    name: ["facebook", "fb"],
    path: "/browser/facebook.png",
  },
  {
    name: ["firefox"],
    path: "/browser/firefox.png",
  },
  {
    name: ["ie", "internet explorer"],
    path: "/browser/ie.png",
  },
  {
    name: ["instagram"],
    path: "/browser/instagram.png",
  },
  {
    name: ["ios", "ios-webview"],
    path: "/browser/ios.png",
  },
  {
    name: ["miui"],
    path: "/browser/miui.png",
  },
  {
    name: ["opera"],
    path: "/browser/opera.png",
  },
  {
    name: ["safari", "safaribrowser", "safari browser"],
    path: "/browser/safari.png",
  },
  {
    name: ["samsung", "samsungbrowser", "samsung browser"],
    path: "/browser/samsung.png",
  },
  {
    name: ["yandex", "yandexbrowser", "yandex browser"],
    path: "/browser/yandex.png",
  },
  {
    name: ["unknown"],
    path: "/fallback-icon.png",
  },
];

export const DEVICE_ICONS = [
  {
    name: ["desktop"],
    path: "/device/desktop.png",
  },
  {
    name: ["mobile"],
    path: "/device/mobile.png",
  },
  {
    name: ["tablet"],
    path: "/device/tablet.png",
  },
  {
    name: ["bot"],
    path: "/device/bot.png",
  },
  {
    name: ["unknown"],
    path: "/fallback-icon.png",
  },
];

export const OS_ICONS = [
  {
    name: ["android"],
    path: "/os/android.png",
  },
  {
    name: ["chrome"],
    path: "/os/chrome.png",
  },
  {
    name: ["ios"],
    path: "/os/ios.png",
  },
  {
    name: ["linux"],
    path: "/os/linux.png",
  },
  {
    name: ["macos", "macosx", "macos x"],
    path: "/os/mac-os.png",
  },
  {
    name: ["windows"],
    path: "/os/windows-10.png",
  },
  {
    name: ["windows7", "windows 7"],
    path: "/os/windows-7.png",
  },
  {
    name: ["windows8", "windows 8"],
    path: "/os/windows-8.png",
  },
  {
    name: ["windows10", "windows 10"],
    path: "/os/windows-10.png",
  },
  {
    name: [
      "windowsserver",
      "windows server",
      "windowsvista",
      "windows vista",
      "windowsxp",
      "windows-xp",
    ],
    path: "/os/windows-server.png",
  },
  {
    name: ["unknown"],
    path: "/fallback-icon.png",
  },
];
