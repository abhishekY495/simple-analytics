export function getPublicAnalyticsUrl(websiteId: string) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error("NEXT_PUBLIC_FRONTEND_URL is not set");
  }

  return `${frontendUrl}/public/${websiteId}`;
}
