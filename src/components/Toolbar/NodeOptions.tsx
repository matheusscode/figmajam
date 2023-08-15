import { useRef, useEffect } from "react";
import { BsSquare, BsCircle } from "react-icons/bs";
import { colorsOptions } from "../../context/ToolsContenxt/colors";
import { useToolsContext } from "../../context/ToolsContenxt/ToolsCreate";

interface NodeOptionsProps {
  options: boolean;
  selectedShape: string;
  onShapeButtonClick: (shapeType: string) => void;
  onClose: () => void;
}

export const NodeOptions = ({
  options,
  onShapeButtonClick,
  onClose,
}: NodeOptionsProps) => {
  const { handleSetColor } = useToolsContext();
  const nodeOptionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        nodeOptionsRef.current &&
        event.target instanceof Node &&
        !nodeOptionsRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (options) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options, onClose]);

  return (
    <div
      ref={nodeOptionsRef}
      className={` absolute left-1/2 transform -translate-x-1/2 bg-white rounded-tr-2xl rounded-tl-2xl border border-zinc-300  h-12 w-[450px] overflow-hidden transition-transform duration-300 ease-in-out ${
        options ? " -translate-y-12 z-2" : " translate-y-0 -z-50"
      }`}
      style={{ visibility: options ? "visible" : "hidden" }}
    >
      <div className="flex items-center h-full ">
        <button
          onClick={() => onShapeButtonClick("square")}
          className="flex items-center hover:bg-black bg-opacity-40 p-1 rounded h-full px-3 rounded-tl-2xl hover:text-white"
        >
          <BsSquare className="transition-colors duration-300 ease-in-out text-[20px]" />
        </button>
        <button
          onClick={() => onShapeButtonClick("elipse")}
          className="flex items-center hover:bg-black bg-opacity-40 p-1 rounded h-full px-3 hover:text-white"
        >
          <BsCircle className="transition-colors duration-300 ease-in-out text-2xl" />
        </button>
        <div className="flex gap-2 items-center justify-center ml-1 border-solid border-l-[1px] border-r-[1px] border-gray-300 px-1 h-full ">
          {colorsOptions.map((colorOption) => (
            <button
              key={colorOption.id}
              onClick={() => handleSetColor(colorOption.color)}
              className={`flex  gap-1 w-[26px] h-[26px] rounded-full shadow-sm shadow-gray-700`}
              style={{ backgroundColor: colorOption.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
