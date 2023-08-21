import { NodeProps, Handle, Position, NodeResizer } from "reactflow";
import { useEffect, useRef, useState } from "react";
import { useToolsContext } from "../../../context/ToolsContext/ToolsCreate";

interface SquareProps extends NodeProps {
  updateNodeData: (id: string, data: any) => void;
}

export const Square = ({ id, selected, data, updateNodeData }: SquareProps) => {
  const [touchSquare, setTouchSquare] = useState<boolean>(false);
  const [text, setText] = useState<string>(data?.text || "");
  const [active, setActive] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { selectedColor } = useToolsContext();
  const [squareColor, setSquareColor] = useState(
    data.nodeColor || selectedColor
  );

  useEffect(() => {
    if (data.nodeColor) {
      setSquareColor(data.nodeColor);
    }
  }, [data.nodeColor]);

  const handleOpenContentSquare = () => {
    if (!selected) {
      setTouchSquare(true);
      setActive(true);
    }
  };

  const handleCloseContentSquare = () => {
    setTouchSquare(false);
    setActive(false);
  };

  const handleMouseLeave = () => {
    if (!selected) {
      setTouchSquare(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const textLength = text.length;

      if (textLength > 29) {
        setExpanded(true);
        textareaRef.current.style.height = "initial";
        textareaRef.current.style.overflow = "hidden";
      } else {
        setExpanded(false);
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflow = "hidden";
      }

      if (updateNodeData) {
        updateNodeData(id, { ...data, text, height: scrollHeight });
      }
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        !event.target ||
        !(event.target instanceof Element) ||
        event.target.closest(".react-flow__node") !== null ||
        event.target === textareaRef.current
      ) {
        return;
      }
      handleCloseContentSquare();
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [text, id, updateNodeData, data]);

  return (
    <div
      className="rounded w-full h-full min-w-[200px] min-h-[200px]"
      style={{ backgroundColor: squareColor }}
      onClick={handleOpenContentSquare}
      onMouseEnter={handleOpenContentSquare}
      onMouseLeave={handleMouseLeave}
    >
      <NodeResizer
        minWidth={200}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
      />

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isValidConnection={(connection) => connection.source === "right"}
        className={`-right-5 w-3 h-3 bg-blue-400/80 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        isValidConnection={(connection) => connection.source === "left"}
        className={`-left-5 w-3 h-3 bg-blue-400/80 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />

      <Handle
        id="top"
        type="source"
        position={Position.Top}
        isValidConnection={(connection) => connection.source === "top"}
        className={`-top-5 w-3 h-3 bg-blue-400/80 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        isValidConnection={(connection) => connection.source === "bottom"}
        className={`-bottom-5 w-3 h-3 bg-blue-400/80 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />
      <div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`absolute inset-0 bg-transparent outline-none border-none text-white p-2 resize-none rounded text-center  ${
            expanded
              ? "h-[200px] transition-all duration-300 p-10"
              : "h-[50px] mt-auto mb-auto transition-all duration-300"
          }`}
          placeholder={(touchSquare || selected) && active ? "Add Text" : ""}
        />
      </div>
    </div>
  );
};

export default Square;
