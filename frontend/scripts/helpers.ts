export function getSessionVisitId(): string | null {
  return typeof window !== "undefined"
    ? window.sessionStorage.getItem(`sa_visit_id`)
    : null;
}

export function setSessionVisitId(visitId: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(`sa_visit_id`, visitId);
  }
}

export function removeSessionVisitId() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(`sa_visit_id`);
  }
}
