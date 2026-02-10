"use client";

import { ObservablePlotRenderer } from "../ObservablePlotRenderer";
import * as Plot from "@observablehq/plot";
import { VisualizerConfig } from "./types";
import { normalizeGraphData } from "./utils";

interface GraphTemplateProps {
  data: any;
  config?: VisualizerConfig;
}

export function GraphTemplate({ data, config }: GraphTemplateProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔵</div>
          <div>No graph data available</div>
        </div>
      </div>
    );
  }

  const normalized = normalizeGraphData(data, config?.dataMapping);
  const style = config?.style || {};
  const layout = config?.layout || {};

  // Apply layout algorithm
  const positionedData = applyLayout(normalized, layout);

  return (
    <div className="h-full flex flex-col">
      {data.title && (
        <div className="mb-2 text-sm font-semibold text-gray-700">
          {data.title}
        </div>
      )}

      <ObservablePlotRenderer
        data={positionedData}
        spec={{
          createSpec: (width: number, height: number) => {
            const nodeRadius = style.nodeSize || Math.min(width, height) * 0.03;
            const fontSize = style.fontSize || Math.min(width, height) * 0.025;

            return {
              width,
              height,
              x: { domain: [0, width], axis: null },
              y: { domain: [0, height], axis: null },
              marks: [
                // Background
                Plot.rect([{}], {
                  x1: 0,
                  x2: width,
                  y1: 0,
                  y2: height,
                  fill: "white",
                  stroke: "#e5e7eb",
                  strokeWidth: 1,
                }),

                // Edges
                Plot.link(positionedData.edges, {
                  x1: "x1",
                  y1: "y1",
                  x2: "x2",
                  y2: "y2",
                  stroke:
                    typeof style.edgeColor === "function"
                      ? (d: any) => (style.edgeColor as Function)(d)
                      : style.edgeColor || "#9CA3AF",
                  strokeWidth:
                    typeof style.edgeWidth === "function"
                      ? (d: any) => (style.edgeWidth as Function)(d)
                      : style.edgeWidth || 2,
                  markerEnd: style.edgeStyle === "arrow" ? "arrow" : undefined,
                  strokeDasharray:
                    style.edgeStyle === "dashed" ? "4,4" : undefined,
                }),

                // Edge labels
                ...(style.showLabels !== false &&
                positionedData.edges.some((e: any) => e.label)
                  ? [
                      Plot.text(positionedData.edges, {
                        x: (d: any) => (d.x1 + d.x2) / 2,
                        y: (d: any) => (d.y1 + d.y2) / 2,
                        text: "label",
                        fontSize: fontSize * 0.8,
                        fill: "#374151",
                        textAnchor: "middle",
                      }),
                    ]
                  : []),

                // Nodes
                Plot.dot(positionedData.nodes, {
                  x: "x",
                  y: "y",
                  r:
                    typeof style.nodeSize === "function"
                      ? (d: any) => (style.nodeSize as Function)(d)
                      : nodeRadius,
                  fill:
                    typeof style.nodeColor === "function"
                      ? (d: any) => (style.nodeColor as Function)(d)
                      : style.nodeColor || getNodeColor(style.colorScheme),
                  stroke: "#1F2937",
                  strokeWidth: 2,
                }),

                // Node labels
                ...(style.showLabels !== false
                  ? [
                      Plot.text(positionedData.nodes, {
                        x: "x",
                        y: "y",
                        text: "label",
                        fontSize: fontSize,
                        fontWeight: "bold",
                        fill: "white",
                        textAnchor: "middle",
                        dy: fontSize * 0.3,
                      }),
                    ]
                  : []),
              ],
            };
          },
        }}
        className="flex-1 border border-gray-200 rounded"
      />

      {style.showValues !== false && (
        <div className="mt-2 text-xs text-gray-500">
          <div>
            Nodes: {positionedData.nodes.length} | Edges:{" "}
            {positionedData.edges.length}
          </div>
        </div>
      )}
    </div>
  );
}

function applyLayout(data: any, layout: any) {
  const { nodes, edges } = data;
  const type = layout.type || "force-directed";
  const width = layout.width || 400;
  const height = layout.height || 300;
  const padding = layout.padding || 50;

  let positionedNodes = [...nodes];

  switch (type) {
    case "circular":
      positionedNodes = applyCircularLayout(nodes, width, height, padding);
      break;
    case "grid":
      positionedNodes = applyGridLayout(nodes, width, height, padding);
      break;
    case "hierarchical":
      positionedNodes = applyHierarchicalLayout(
        nodes,
        edges,
        width,
        height,
        padding,
        layout,
      );
      break;
    case "manual":
      // Use existing positions or default
      positionedNodes = nodes.map((n: any) => ({
        ...n,
        x: n.x || width / 2,
        y: n.y || height / 2,
      }));
      break;
    case "force-directed":
    default:
      positionedNodes = applyForceLayout(
        nodes,
        edges,
        width,
        height,
        padding,
        layout,
      );
      break;
  }

  // Position edges based on node positions
  const nodeMap = new Map(positionedNodes.map((n: any) => [n.id, n]));
  const positionedEdges = edges.map((e: any) => {
    const source = nodeMap.get(e.source);
    const target = nodeMap.get(e.target);
    return {
      ...e,
      x1: source?.x || 0,
      y1: source?.y || 0,
      x2: target?.x || 0,
      y2: target?.y || 0,
    };
  });

  return { nodes: positionedNodes, edges: positionedEdges };
}

function applyCircularLayout(
  nodes: any[],
  width: number,
  height: number,
  padding: number,
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - padding;

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

function applyGridLayout(
  nodes: any[],
  width: number,
  height: number,
  padding: number,
) {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);
  const cellWidth = (width - 2 * padding) / cols;
  const cellHeight = (height - 2 * padding) / rows;

  return nodes.map((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      ...node,
      x: padding + col * cellWidth + cellWidth / 2,
      y: padding + row * cellHeight + cellHeight / 2,
    };
  });
}

function applyHierarchicalLayout(
  nodes: any[],
  edges: any[],
  width: number,
  height: number,
  padding: number,
  layout: any,
) {
  // Simple hierarchical layout - assign levels based on edges
  const nodeMap = new Map(nodes.map((n: any) => [n.id, { ...n, level: 0 }]));

  // Calculate levels (simplified)
  edges.forEach((e: any) => {
    const target = nodeMap.get(e.target);
    const source = nodeMap.get(e.source);
    if (target && source) {
      target.level = Math.max(target.level, source.level + 1);
    }
  });

  const levels = Array.from(nodeMap.values()).map((n: any) => n.level);
  const maxLevel = Math.max(...levels, 0);

  const levelCounts = new Map<number, number>();
  nodeMap.forEach((n: any) => {
    levelCounts.set(n.level, (levelCounts.get(n.level) || 0) + 1);
  });

  const levelPositions = new Map<number, number>();

  return Array.from(nodeMap.values()).map((node: any) => {
    const level = node.level;
    const nodesInLevel = levelCounts.get(level) || 1;
    const positionInLevel = levelPositions.get(level) || 0;
    levelPositions.set(level, positionInLevel + 1);

    return {
      ...node,
      x:
        padding +
        ((positionInLevel + 0.5) / nodesInLevel) * (width - 2 * padding),
      y: padding + (level / (maxLevel || 1)) * (height - 2 * padding),
    };
  });
}

function applyForceLayout(
  nodes: any[],
  edges: any[],
  width: number,
  height: number,
  padding: number,
  layout: any,
) {
  // Simple force-directed layout simulation
  const iterations = 50;
  const linkDistance = layout.linkDistance || 100;
  const forceStrength = layout.forceStrength || 0.1;

  // Initialize positions randomly
  let positioned = nodes.map((node) => ({
    ...node,
    x: node.x || padding + Math.random() * (width - 2 * padding),
    y: node.y || padding + Math.random() * (height - 2 * padding),
    vx: 0,
    vy: 0,
  }));

  const nodeMap = new Map(positioned.map((n: any) => [n.id, n]));

  for (let iter = 0; iter < iterations; iter++) {
    // Apply forces
    positioned.forEach((node: any) => {
      node.vx = 0;
      node.vy = 0;

      // Repulsion between all nodes
      positioned.forEach((other: any) => {
        if (node.id !== other.id) {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const force = (forceStrength * 100) / dist;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      });

      // Attraction along edges
      edges.forEach((edge: any) => {
        if (edge.source === node.id) {
          const target = nodeMap.get(edge.target);
          if (target) {
            const dx = target.x - node.x;
            const dy = target.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
            const force = (dist - linkDistance) * forceStrength;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }
        if (edge.target === node.id) {
          const source = nodeMap.get(edge.source);
          if (source) {
            const dx = source.x - node.x;
            const dy = source.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
            const force = (dist - linkDistance) * forceStrength;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }
      });
    });

    // Update positions
    positioned.forEach((node: any) => {
      node.x += node.vx;
      node.y += node.vy;

      // Keep within bounds
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
    });
  }

  return positioned;
}

function getNodeColor(scheme?: string): (d: any) => string {
  switch (scheme) {
    case "chemistry":
      return (d: any) => (d.isCentral ? "#EF4444" : "#3B82F6");
    case "biology":
      return (d: any) => (d.type === "active" ? "#10B981" : "#6B7280");
    case "physics":
      return (d: any) => "#8B5CF6";
    case "math":
      return (d: any) => "#F59E0B";
    case "cs":
      return (d: any) => "#06B6D4";
    default:
      return (d: any) => (d.type ? getTypeColor(d.type) : "#3B82F6");
  }
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    central: "#EF4444",
    terminal: "#3B82F6",
    active: "#10B981",
    inactive: "#6B7280",
    start: "#10B981",
    end: "#EF4444",
  };
  return colors[type] || "#3B82F6";
}
