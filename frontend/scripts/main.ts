import { HEARTBEAT_INTERVAL } from "./constants";
import { getSessionVisitId } from "./helpers";
import { sendAnalytics } from "./send-analytics";
import { sendHeartbeat } from "./send-heartbeat";

const API_URL = "https://simple-analytics-kz3z.onrender.com";

let lastPath: string | null = null;

async function trackPageView(apiUrl: string, websiteId: string) {
  const currentPath = window.location.pathname + window.location.search;

  // Avoid double-sending for the same URL
  if (currentPath === lastPath) return;
  lastPath = currentPath;

  await sendAnalytics(apiUrl, websiteId);
}

function setupSpaTracking(apiUrl: string, websiteId: string) {
  const handleLocationChange = () => {
    void trackPageView(apiUrl, websiteId);
  };

  // Patch history.pushState
  const originalPushState = history.pushState;
  history.pushState = function (...args: Parameters<History["pushState"]>) {
    // Call the original
    originalPushState.apply(this, args);
    handleLocationChange();
  };

  // Patch history.replaceState
  const originalReplaceState = history.replaceState;
  history.replaceState = function (
    ...args: Parameters<History["replaceState"]>
  ) {
    originalReplaceState.apply(this, args);
    handleLocationChange();
  };

  // Back/forward buttons
  window.addEventListener("popstate", handleLocationChange);
}

(async function () {
  const script = document.currentScript as HTMLScriptElement | null;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) {
    return;
  }

  // Initial page view
  await trackPageView(API_URL, websiteId);

  // Track further SPA navigations (Next.js, React Router, etc.)
  setupSpaTracking(API_URL, websiteId);

  const sessionVisitId = getSessionVisitId();
  if (!sessionVisitId) {
    return;
  }

  const heartbeatIntervalId = setInterval(() => {
    sendHeartbeat(API_URL, sessionVisitId);
  }, HEARTBEAT_INTERVAL);

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      clearInterval(heartbeatIntervalId);
    }
  });
})();
