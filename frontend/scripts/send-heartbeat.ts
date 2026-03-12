export function sendHeartbeat(API_URL: string, visitId: string) {
  fetch(`${API_URL}/analytics/heartbeat`, {
    method: "POST",
    body: JSON.stringify({ visit_id: visitId }),
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  });
}
