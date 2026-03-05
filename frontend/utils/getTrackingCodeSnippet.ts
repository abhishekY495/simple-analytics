export function getTrackingCodeSnippet(id: string): string {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error("NEXT_PUBLIC_FRONTEND_URL is not set");
  }

  return `<script defer src="${frontendUrl}/script.js" data-website-id="${id}"></script>`;
}
