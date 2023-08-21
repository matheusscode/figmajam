import React, { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { NodeOptions } from "./NodeOptions";
import { useToolsContext } from "../../context/ToolsContext/ToolsCreate";
import pencel from "../../../public/pencel.svg";

interface ToolbarProps {
  setNodes: React.Dispatch<
    React.SetStateAction<Node<any, string | undefined>[]>
  >;
  selectedShape: string;
  setSelectedShape: React.Dispatch<React.SetStateAction<string>>;
  isBrushActive: boolean;
  setIsBrushActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Toolbar = ({
  setNodes,
  selectedShape,
  setSelectedShape,
  isBrushActive,
  setIsBrushActive,
}: ToolbarProps) => {
  const [options, setOptions] = useState<boolean>(false);
  const { selectedColor, handleSetColor } = useToolsContext();

  const handleCloseNodeOptions = () => {
    setOptions(false);
  };

  const addNode = () => {
    setNodes((nodes) => [
      ...nodes,
      {
        id: uuidv4(),
        type: selectedShape,
        position: {
          x: 750,
          y: 350,
        },
        data: {
          text: "",
          nodeColor: selectedColor,
        },
      },
    ]);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleShapeButtonClick = (shapeType: string) => {
    setSelectedShape(shapeType);
    handleSetColor(selectedColor);
  };

  return (
    <aside className="fixed flex bottom-16 left-1/2 z-50 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-4 h-16 w-1/3 ">
      <div className="flex gap-6 h-16 overflow-hidden">
        <button
          className={`transition-all hover:-translate-y-2 mix-blend-multiply bg-transparent`}
          onClick={() => setIsBrushActive(!isBrushActive)}
        >
          <img
            src={pencel}
            alt="Pencel"
            className="w-[50px] object-cover mix-blend-multiply bg-transparent mt-2"
          />
        </button>
        <button
          onClick={addNode}
          onDragStart={(event) => {
            const divEvent = event as any;
            onDragStart(divEvent, selectedShape);
          }}
          draggable
          style={{ backgroundColor: selectedColor }}
          className={`w-28 h-36 mt-6 Z-10 ${
            selectedShape === "elipse" ? "rounded-full" : null
          } transition-all hover:-translate-y-2`}
        />
      </div>
      <button
        className=" absolute  h-6 w-6 ml-1 transform - translate-x-28 ml-[78px] mt-2 border-zinc-700 rounded-2xl  text-xl text-black shadow-md justify-center"
        onClick={() => setOptions(!options)}
      >
        <IoIosArrowUp className="w-6" />
      </button>
      <NodeOptions
        onClose={handleCloseNodeOptions}
        options={options}
        selectedShape={selectedShape}
        onShapeButtonClick={handleShapeButtonClick}
      />
    </aside>
  );
};

export default Toolbar;
