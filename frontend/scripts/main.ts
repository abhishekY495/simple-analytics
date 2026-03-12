import { sendAnalytics } from "./send-analytics";

// const API_URL = "http://localhost:8080";
const API_URL = "https://simple-analytics-kz3z.onrender.com";

(async function () {
  const script = document.currentScript as HTMLScriptElement;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) {
    console.error("Website ID is required");
    return;
  }

  await sendAnalytics(API_URL, websiteId);
})();
