import React, { useEffect, useState } from "react";
import { BsSquare, BsCircle } from "react-icons/bs";

import { IoIosArrowUp } from "react-icons/io";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";

interface SidebarProps {
  setNodes: React.Dispatch<
    React.SetStateAction<Node<any, string | undefined>[]>
  >;

  selectedShape: string;
  setSelectedShape: React.Dispatch<React.SetStateAction<string>>;
}

interface NodeOptionsProps {
  options: boolean;
  selectedShape: string;
  onShapeButtonClick: (shapeType: string) => void;
}

export const Sidebar = ({
  setNodes,
  selectedShape,
  setSelectedShape,
}: SidebarProps) => {
  const [options, setOptions] = useState<boolean>(false);

  useEffect(() => {}, [selectedShape]);

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

  const NodeOptions = ({ options, onShapeButtonClick }: NodeOptionsProps) => {
    return (
      <div
        className={` absolute left-1/2 transform -translate-x-1/2 bg-white rounded-tr-2xl rounded-tl-2xl border border-zinc-300  h-12 w-1/2 overflow-hidden transition-transform duration-300 ease-in-out ${
          options ? " -translate-y-12 z-2" : " translate-y-0 -z-50"
        }`}
        style={{ visibility: options ? "visible" : "hidden" }}
      >
        <div className="flex items-center h-full ">
          <button
            onClick={() => onShapeButtonClick("square")}
            className="flex items-center hover:bg-black bg-opacity-40 p-1 rounded h-full px-3 rounded-tl-2xl hover:text-white"
          >
            <BsSquare className="transition-colors duration-300 ease-in-out" />
          </button>
          <button
            onClick={() => onShapeButtonClick("elipse")}
            className="flex items-center hover:bg-black bg-opacity-40 p-1 rounded  h-full  px-3  hover:text-white"
          >
            <BsCircle className="transition-colors duration-300 ease-in-out" />
          </button>
        </div>

        <ul className="flex gap-1 items-center h-full border-r-2 border-black ">
          <li>
            <button>b</button>
          </li>
          <li>
            <button>b</button>
          </li>
          <li>
            <button>b</button>
          </li>
          <li>
            <button>b</button>
          </li>
        </ul>
      </div>
    );
  };

  const handleShapeButtonClick = (shapeType: string) => {
    setSelectedShape(shapeType);
  };

  return (
    <aside className="fixed flex bottom-16 left-1/2 z-50 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-16 w-1/3 ">
      <div className="h-16 overflow-hidden">
        <button
          onClick={addNode}
          onDragStart={(event) => {
            const divEvent = event as any;
            onDragStart(divEvent, selectedShape);
          }}
          draggable
          className={`w-28 h-36 bg-violet-500 mt-6 ${
            selectedShape === "elipse" ? "rounded-full" : null
          } transition-all hover:-translate-y-2`}
        />
      </div>
      <button
        className=" absolute  h-6 w-6 ml-1 transform - translate-x-28 ml-2 mt-2 border-zinc-700 rounded-2xl  text-xl text-black shadow-md justify-center"
        onClick={() => setOptions(!options)}
      >
        <IoIosArrowUp className="w-6" />
      </button>
      <NodeOptions
        options={options}
        selectedShape={selectedShape}
        onShapeButtonClick={handleShapeButtonClick}
      />
    </aside>
  );
};

export default Sidebar;
