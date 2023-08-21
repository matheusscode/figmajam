import { useContext } from "react";
import ToolsContext from "./ToolsCreate";

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedColor deve ser usado dentro de SelectedColorProvider"
    );
  }
  return context;
};
