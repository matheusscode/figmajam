import { NodeProps, Handle, Position, NodeResizer } from "reactflow";

import "@reactflow/node-resizer/dist/style.css";
import { useEffect, useRef, useState } from "react";

export function Square({ id, selected, data, updateNode }: NodeProps) {
  const [text, setText] = useState(data?.text || "");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;

      // Atualiza as dimensões do nó
      if (updateNode) {
        updateNode(id, {
          ...data,
          height: scrollHeight,
        });
      }
    }
  }, [text, id, updateNode, data]);

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
      {data?.text !== undefined && (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="absolute inset-0 bg-transparent outline-none border-none text-white p-2 resize-none rounded text-center h-10 mt-20"
          placeholder="Digite algo aqui..."
          onBlur={() => {
            if (!text.trim()) {
              setText("");
            }
          }}
        />
      )}
    </div>
  );
}
