import { getSessionVisitId, setSessionVisitId } from "./helpers";
import { AnalyticsPayload, AnalyticsResponse } from "./types";

export async function sendAnalytics(API_URL: string, websiteId: string) {
  const sessionVisitId = getSessionVisitId();
  let referrer = document.referrer;

  if (referrer.includes(location.hostname)) {
    referrer = "self";
  } else if (referrer.length === 0) {
    referrer = "direct";
  }

  const payload: AnalyticsPayload = {
    visit_id: sessionVisitId,
    path: location.pathname,
    referrer: referrer,
    user_agent: navigator.userAgent,
  };

  const response = await fetch(`${API_URL}/analytics/${websiteId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  const data: AnalyticsResponse = await response.json();
  if (data.status === "error") {
    console.error(data.status_message);
    return;
  }

  const newVisitId = data.data?.visit_id || null;
  payload.visit_id = newVisitId;

  if (newVisitId) {
    setSessionVisitId(newVisitId);
  }
}
