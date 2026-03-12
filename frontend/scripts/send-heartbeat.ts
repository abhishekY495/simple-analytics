export function sendHeartbeat(API_URL: string, visitId: string) {
  navigator.sendBeacon(
    `${API_URL}/analytics/heartbeat`,
    JSON.stringify({ visit_id: visitId }),
  );
}
