import { HEARTBEAT_INTERVAL } from "./constants";
import { getSessionVisitId } from "./helpers";
import { sendAnalytics } from "./send-analytics";
import { sendHeartbeat } from "./send-heartbeat";

const API_URL = "https://simple-analytics-kz3z.onrender.com";

(async function () {
  const script = document.currentScript as HTMLScriptElement;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) {
    return;
  }

  await sendAnalytics(API_URL, websiteId);

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
