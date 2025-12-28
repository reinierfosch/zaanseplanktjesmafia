import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getAnalyticsEndpoint, getAnalyticsWebsiteId } from "./lib/env";

// Inject analytics script if environment variables are set
const analyticsEndpoint = getAnalyticsEndpoint();
const analyticsWebsiteId = getAnalyticsWebsiteId();

if (analyticsEndpoint && analyticsWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `${analyticsEndpoint}/umami`;
  script.setAttribute("data-website-id", analyticsWebsiteId);
  document.body.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
