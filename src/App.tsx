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
  OnConnectStart,
  OnConnectEnd,
  OnEdgeUpdateFunc,
  Edge,
  ReactFlowInstance,
} from "reactflow";
import { NodeTypes } from "react-flow-renderer";
import { zinc } from "tailwindcss/colors";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";

import Square from "./components/Nodes/Square";
import Elipse from "./components/Nodes/Elipse";
import DefaultEdge from "./components/Edges/DefaultEdge";
import Toolbar from "./components/Toolbar";
import { useToolsContext } from "./context/ToolsContenxt/ToolsCreate";

interface NodeData {
  text: string;
}

interface CustomNode extends Node {
  data: NodeData;
}

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

const NODE_TYPES: NodeTypes | any = {
  square: Square,
  elipse: Elipse,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

export default function App() {
  const edgeUpdateSuccessful = useRef(true);
  const { selectedColor } = useToolsContext();
  const [selectedShape, setSelectedShape] = useState<string>("square");
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
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
            type: selectedShape,
            position: project({
              x: clientX - left - 75,
              y: clientY - top,
            }),
            data: {
              text: "",
              nodeColor: selectedColor,
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
    [project, selectedShape, selectedColor]
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      });
      const newNode: Node = {
        id: uuidv4(),
        type: selectedShape,
        position,
        data: {
          text: "",
          nodeColor: selectedColor,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, selectedShape, selectedColor]
  );

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
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        defaultEdgeOptions={{
          type: "default",
        }}
      >
        <MiniMap zoomable pannable />
        <Background gap={12} size={2} color={zinc[200]} />
        <Controls />
      </ReactFlow>
      <Toolbar
        setNodes={setNodes}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
      />
    </div>
  );
}
