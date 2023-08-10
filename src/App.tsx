import { useCallback, useRef, useState } from "react";
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
} from "reactflow";
import * as Toolbar from "@radix-ui/react-toolbar";
import { zinc } from "tailwindcss/colors";
import { IoIosArrowUp } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";

import { Square } from "./components/Nodes/Square";
import DefaultEdge from "./components/Edges/DefaultEdge";

const NODE_TYPES = {
  square: Square,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const INITIAL_NODES = [
  {
    id: uuidv4(),
    type: "square",
    position: {
      x: 860,
      y: 300,
    },
    data: {
      text: "",
    },
  },
] as Node[];

export default function App() {
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const { project } = useReactFlow();

  const [nodeTypes, setNodeType] = useState();

  const onConnect = useCallback((connection: Connection) => {
    return setEdges((edges) => addEdge(connection, edges));
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = uuidv4();
        const newNode = {
          id,
          type: "square",
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          data: {
            text: "",
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        );
      }
    },
    [project]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodeDragStop = useCallback(
    (event, node) => {
      const updatedNodes = nodes.map((n) =>
        n.id === node.id ? { ...n, ...node.data } : n
      );
      setNodes(updatedNodes);
    },
    [nodes]
  );

  function addSquareNode() {
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
  }

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

      <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-1/4 overflow-hidden">
        <Toolbar.Button
          onClick={addSquareNode}
          className="w-32 h-32 bg-violet-500 mt-6 rounded transition-transform hover:-translate-y-2"
        />
        <Toolbar.Button className=" absolute  h-6 w-6 ml-1 mt-2 border-zinc-700 rounded-2xl  text-xl text-black shadow-md justify-center">
          <IoIosArrowUp className="w-6" />
        </Toolbar.Button>
      </Toolbar.Root>
    </div>
  );
}
