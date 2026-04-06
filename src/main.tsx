import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import TagManager from "react-gtm-module";

createRoot(document.getElementById("root")!).render(<App />);
const tagManagerArgs = {
    gtmId: import.meta.env.VITE_GTM_ID,
    dataLayer: {
        app_version: "1.0.1",
        environment: import.meta.env.MODE,
    }

};

TagManager.initialize(tagManagerArgs);