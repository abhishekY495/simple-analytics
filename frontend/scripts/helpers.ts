export function getSessionVisitId(): string | null {
  return sessionStorage.getItem("sav_id") || null;
}

export function setSessionVisitId(visitId: string) {
  sessionStorage.setItem("sav_id", visitId);
}
