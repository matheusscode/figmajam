import { useState, ReactNode } from "react";
import ToolsContext from "./ToolsCreate";

interface ToolsProviderProps {
  children: ReactNode;
}

export const ToolsProvider = ({ children }: ToolsProviderProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("#8B5CF6");

  const handleSetColor = (color: string) => {
    setSelectedColor(color);
  };

  const contextValue = {
    selectedColor,
    handleSetColor,
    setSelectedColor,
  };

  return (
    <ToolsContext.Provider value={contextValue}>
      {children}
    </ToolsContext.Provider>
  );
};
