import "reactflow/dist/style.css";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Position,
} from "reactflow";
import type { Edge, Node } from "reactflow";
import { useMemo } from "react";
import dagre from "dagre";

export interface DatabaseStructure {
  collection: string;
  data: Array<{
    name: string;
    value: string;
    embedded?: DatabaseStructure[];
  }>;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export default function DiagramScreen({
  structure,
}: {
  structure: DatabaseStructure[];
}) {
  const nodes = useMemo(() => {
    const edges: Edge[] = [];
    const nodes: Node[] = [];

    structure.forEach((collection) => {
      if (!collection.data.length) return;
      nodes.push({
        id: collection.collection,
        data: {
          label: collection.collection,
        },
        position: { x: 0, y: 0 },
        type: "input",
      });

      collection.data.forEach((field) => {
        nodes.push({
          id: `${collection.collection}-${field.name}`,
          data: {
            label: field.name,
          },
          position: { x: 0, y: 0 },
          type: !field.embedded?.length ? "output" : "default",
        });

        edges.push({
          id: `${collection.collection}-${field.name}-edge`,
          source: collection.collection,
          target: `${collection.collection}-${field.name}`,
          type: "smoothstep",
        });
      });
    });

    return getLayoutedElements(nodes, edges, "TB");
  }, [structure]);

  return (
    <div className="h-screen w-screen">
      <ReactFlow nodes={nodes.nodes} edges={nodes.edges}>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
