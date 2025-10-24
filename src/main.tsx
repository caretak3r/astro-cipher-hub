import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
