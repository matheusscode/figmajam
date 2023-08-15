import { createContext, useContext } from "react";

interface ToolsContextProps {
  selectedColor: string;
  handleSetColor: (color: string) => void;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
}

const ToolsContext = createContext<ToolsContextProps | undefined>(undefined);

export const useToolsContext = () => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error("useToolsContext must be used within a ToolsProvider");
  }
  return context;
};

export default ToolsContext;
