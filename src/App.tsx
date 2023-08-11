import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  Connection,
  useEdgesState,
  useNodesState,
  ConnectionMode,
  Node,
  useReactFlow,
  MiniMap,
  updateEdge,
  addEdge,
  OnConnectStart,
  OnConnectEnd,
  OnEdgeUpdateFunc,
  Edge,
} from "reactflow";
import { NodeTypes } from "react-flow-renderer";
import { zinc } from "tailwindcss/colors";
import { IoIosArrowUp } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";

import { Square } from "./components/Nodes/Square";
import { Elipse } from "./components/Nodes/Elipse";
import DefaultEdge from "./components/Edges/DefaultEdge";

interface NodeData {
  text: string;
}

interface CustomNode extends Node {
  data: NodeData;
}

const NODE_TYPES: NodeTypes | any = {
  square: Square,
  elipse: Elipse,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const INITIAL_NODES = [
  {
    id: uuidv4(),
    type: "square",
    position: {
      x: 770,
      y: 300,
    },
    data: {
      text: "",
    },
  },
  {
    id: uuidv4(),
    type: "elipse",
    position: {
      x: 370,
      y: 300,
    },
    data: {
      text: "",
    },
  },
] as Node[];

export default function App() {
  const [options, setOptions] = useState<boolean>();
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const { project } = useReactFlow();

  const onConnect = useCallback((connection: Connection) => {
    return setEdges((edges) => addEdge(connection, edges));
  }, []);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      let clientX, clientY;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      }

      if (clientX !== undefined && clientY !== undefined) {
        const targetIsPane =
          event.target instanceof HTMLElement &&
          event.target.classList.contains("react-flow__pane");

        if (targetIsPane) {
          const { top, left } =
            reactFlowWrapper.current?.getBoundingClientRect() || {
              top: 0,
              left: 0,
            };
          const id = uuidv4();
          const newNode = {
            id,
            type: "square",
            position: project({
              x: clientX - left - 75,
              y: clientY - top,
            }),
            data: {
              text: "",
            },
          };

          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({
              id,
              source: connectingNodeId.current || "",
              target: id,
            })
          );
        }
      }
    },
    [project]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    []
  );

  const onEdgeUpdateEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    []
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: CustomNode) => {
      const updatedNodes = nodes.map((n) =>
        n.id === node.id ? { ...n, ...node.data } : n
      );
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const addSquareNode = () => {
    setNodes((nodes) => [
      ...nodes,
      {
        id: uuidv4(),
        type: "square",
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

  return (
    <div className="w-screen h-screen relative" ref={reactFlowWrapper}>
      <ReactFlow
        onNodeDragStop={onNodeDragStop}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodesChange={onNodesChange}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: "default",
        }}
      >
        <MiniMap zoomable pannable />
        <Background gap={12} size={2} color={zinc[200]} />
        <Controls />
      </ReactFlow>

      <div className="fixed flex bottom-16 left-1/2 z-50 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-16 w-1/3 ">
        <div className="h-16 overflow-hidden">
          <button
            onClick={addSquareNode}
            className="w-28 h-32 bg-violet-500 mt-6 rounded transition-transform hover:-translate-y-2"
          />
        </div>
        <button
          className=" absolute  h-6 w-6 ml-1 transform - translate-x-28 ml-2 mt-2 border-zinc-700 rounded-2xl  text-xl text-black shadow-md justify-center"
          onClick={() => setOptions(!options)}
        >
          <IoIosArrowUp className="w-6" />
        </button>
        <NodeOptions options={options} />
      </div>
    </div>
  );
}

function NodeOptions({ options }: any) {
  return (
    <div
      className={` absolute left-1/2 transform -translate-x-1/2 bg-white rounded-tr-2xl rounded-tl-2xl border border-zinc-300 px-3 h-12 w-1/2 overflow-hidden transition-transform duration-300 ease-in-out ${
        options ? " -translate-y-12 z-2" : " translate-y-0 -z-50"
      }`}
      style={{ visibility: options ? "visible" : "hidden" }}
    >
      <ul className="flex gap-1 items-center h-full w-full">
        <li>d</li>
        <li>d</li>
        <li>d</li>
      </ul>
    </div>
  );
}
