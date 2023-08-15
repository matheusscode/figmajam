import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { ReactFlowProvider } from "reactflow";
import { ToolsProvider } from "./context/ToolsContenxt/ToolsProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ToolsProvider>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </ToolsProvider>
);
