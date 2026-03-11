import { AnalyticsPayload } from "@/types/analytics";
import { logFunc } from "./helper";

(function () {
  const isDev = !true;
  const API_URL = isDev
    ? "http://localhost:8080"
    : "https://simple-analytics-kz3z.onrender.com";
  const script = document.currentScript as HTMLScriptElement;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) {
    console.error("Website ID is required");
    return;
  }

  function collect() {
    const payload: AnalyticsPayload = {
      path: location.pathname,
      referrer: document.referrer || "unknown",
      hostname: location.hostname,
      user_agent: navigator.userAgent,
    };

    console.log(payload);

    fetch(`${API_URL}/analytics/${websiteId}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  }

  logFunc();
  collect();
})();
