import { NodeProps, Handle, Position, NodeResizer } from "reactflow";
import { useEffect, useRef, useState } from "react";

export function Square({ id, selected, data, updateNode }: NodeProps) {
  const [text, setText] = useState<string>(data?.text || "");
  const [active, setActive] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleOpen = () => {
    setActive(true);
  };

  const handleClose = () => {
    setActive(false);
  };

  console.log(text.length);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const textLength = text.length;

      if (textLength > 21) {
        setExpanded(true);
        textareaRef.current.style.height = "initial";
        textareaRef.current.style.overflow = "hidden";
      } else {
        setExpanded(false);
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflow = "hidden";
      }

      if (updateNode) {
        updateNode(id, {
          ...data,
          height: scrollHeight,
        });
      }
    }
  }, [text, id, updateNode, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node) &&
        !expanded
      ) {
        handleClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expanded]);

  return (
    <div className="bg-violet-500 rounded w-full h-full min-w-[200px] min-h-[200px]">
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
        className="-right-5 w-3 h-3 bg-blue-400/80"
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className="-left-5 w-3 h-3 bg-blue-400/80"
      />

      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className="-top-5 w-3 h-3 bg-blue-400/80"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="-bottom-5 w-3 h-3 bg-blue-400/80"
      />
      <div onClick={handleOpen}>
        <textarea
          ref={textareaRef}
          value={text}
          onClick={handleOpen}
          onFocus={handleClose}
          onChange={(e) => setText(e.target.value)}
          className={`absolute inset-0 bg-transparent outline-none border-none text-white p-2 resize-none rounded text-center ${
            expanded
              ? "h-[200px] transition-all duration-300"
              : "h-[30px] mt-auto mb-auto transition-all duration-300"
          }`}
          placeholder="Digite algo aqui..."
          onBlur={() => {
            if (!text.trim()) {
              setText("");
            }
          }}
        />
      </div>
    </div>
  );
}
