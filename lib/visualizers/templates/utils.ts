// Utility functions for extracting data using mapping configuration

/**
 * Detects if a value is a primitive (string, number, boolean, null, undefined)
 */
export function isPrimitive(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * Converts primitive values into visualizable structures
 */
export function wrapPrimitive(value: any, template?: string): any {
  if (!isPrimitive(value)) return value;

  // For strings, convert to character array
  if (typeof value === "string") {
    return {
      elements: value.split("").map((char, index) => ({
        id: index,
        value: char,
        state: "default",
      })),
      result: value,
      type: "string",
    };
  }

  // For numbers, create a simple table representation
  if (typeof value === "number") {
    return {
      elements: [
        {
          property: "Value",
          value: value.toString(),
          type: typeof value,
        },
      ],
      result: value,
      type: "number",
    };
  }

  // For booleans
  if (typeof value === "boolean") {
    return {
      elements: [
        {
          property: "Result",
          value: value.toString(),
          type: "boolean",
        },
      ],
      result: value,
      type: "boolean",
    };
  }

  // For null/undefined
  return {
    elements: [
      {
        property: "Result",
        value: String(value),
        type: typeof value,
      },
    ],
    result: value,
    type: typeof value,
  };
}

/**
 * Auto-detects the best template for a given data structure
 */
export function detectBestTemplate(data: any): string {
  // If it's a primitive, use array for strings, table for others
  if (isPrimitive(data)) {
    if (typeof data === "string") return "array";
    return "table";
  }

  // If it has nodes/edges, it's a graph
  if (data.nodes && data.edges) return "graph";

  // If it's a tree structure (has children or root)
  if (data.root || data.children) return "tree";

  // If it's a 2D array or has rows/cols, it's a grid
  if (Array.isArray(data) && Array.isArray(data[0])) return "grid";
  if (data.grid || (data.rows && data.cols)) return "grid";

  // If it has series or chart-like data
  if (data.series || (data.xAxis && data.yAxis)) return "chart";

  // If it's a simple array
  if (Array.isArray(data)) return "array";

  // Default to table for objects
  return "table";
}

export function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;

  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value === null || value === undefined) return undefined;
    value = value[key];
  }

  return value;
}

export function applyDataMapping(data: any, mapping: any, field: string): any {
  if (!mapping || !mapping[field]) return data[field];
  return getNestedValue(data, mapping[field]);
}

export function normalizeGraphData(data: any, mapping?: any): any {
  const nodes = applyDataMapping(data, mapping, "nodes") || data.nodes || [];
  const edges = applyDataMapping(data, mapping, "edges") || data.edges || [];

  const nodeIdField = mapping?.nodeId || "id";
  const nodeLabelField = mapping?.nodeLabel || "label";
  const edgeSourceField = mapping?.edgeSource || "source";
  const edgeTargetField = mapping?.edgeTarget || "target";

  return {
    nodes: nodes.map((node: any) => ({
      id: node[nodeIdField] || node.id || node.uuid,
      label:
        node[nodeLabelField] ||
        node.label ||
        node.name ||
        String(node[nodeIdField]),
      type: node.type,
      ...node,
    })),
    edges: edges.map((edge: any) => ({
      source: edge[edgeSourceField] || edge.source || edge.from,
      target: edge[edgeTargetField] || edge.target || edge.to,
      weight: edge.weight || edge.value || 1,
      label: edge.label,
      type: edge.type,
      ...edge,
    })),
  };
}

export function normalizeTreeData(data: any, mapping?: any): any {
  const root = applyDataMapping(data, mapping, "root") || data.root || data;
  const childrenField = mapping?.children || "children";

  const normalize = (node: any): any => {
    if (!node) return null;

    return {
      id: node.id || node.uuid,
      value: node.value,
      label: node.label || node.name || String(node.value),
      children: node[childrenField]?.map(normalize) || [],
      ...node,
    };
  };

  return normalize(root);
}

export function normalizeArrayData(data: any, mapping?: any): any {
  const elements =
    applyDataMapping(data, mapping, "elements") || data.elements || data;
  const valueField = mapping?.value || "value";
  const stateField = mapping?.state || "state";

  if (!Array.isArray(elements)) {
    return { elements: [], currentOperation: data.currentOperation };
  }

  return {
    elements: elements.map((el: any, idx: number) => ({
      value: el[valueField] !== undefined ? el[valueField] : el,
      index: el.index !== undefined ? el.index : idx,
      state: el[stateField] || el.state,
      highlight: el.highlight || false,
      ...el,
    })),
    currentOperation: data.currentOperation,
  };
}

export function normalizeGridData(data: any, mapping?: any): any {
  const grid = applyDataMapping(data, mapping, "grid") || data.grid || data;

  if (Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0])) {
    // Already a 2D array
    return {
      grid,
      dimensions: {
        rows: grid.length,
        cols: grid[0]?.length || 0,
      },
    };
  }

  // Try to construct from cells array
  const cells = Array.isArray(grid) ? grid : data.cells || [];
  if (cells.length === 0) {
    return { grid: [[]], dimensions: { rows: 0, cols: 0 } };
  }

  const maxRow = Math.max(...cells.map((c: any) => c.row || 0));
  const maxCol = Math.max(...cells.map((c: any) => c.col || 0));

  const grid2D = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxCol + 1).fill(null));

  cells.forEach((cell: any) => {
    const row = cell.row || 0;
    const col = cell.col || 0;
    grid2D[row][col] = cell.value !== undefined ? cell.value : cell;
  });

  return {
    grid: grid2D,
    dimensions: { rows: maxRow + 1, cols: maxCol + 1 },
  };
}

export function normalizeChartData(data: any, mapping?: any): any {
  const series =
    applyDataMapping(data, mapping, "series") || data.series || data;
  const xField = mapping?.xAxis || "x";
  const yField = mapping?.yAxis || "y";

  if (!Array.isArray(series)) {
    return { series: [], metadata: data.metadata || {} };
  }

  return {
    series: series.map((point: any) => ({
      x: point[xField] !== undefined ? point[xField] : point.x,
      y: point[yField] !== undefined ? point[yField] : point.y,
      label: point.label,
      ...point,
    })),
    metadata: data.metadata || {},
  };
}

export function normalizeSpatialData(data: any, mapping?: any): any {
  const objects =
    applyDataMapping(data, mapping, "objects") || data.objects || data;
  const positionField = mapping?.position || "position";

  if (!Array.isArray(objects)) {
    return { objects: [] };
  }

  return {
    objects: objects.map((obj: any, idx: number) => ({
      id: obj.id || obj.uuid || idx,
      position: obj[positionField] || obj.position || { x: 0, y: 0 },
      type: obj.type,
      shape: obj.shape,
      ...obj,
    })),
  };
}

export function normalizeStateMachineData(data: any, mapping?: any): any {
  const states = applyDataMapping(data, mapping, "states") || data.states || [];
  const transitions =
    applyDataMapping(data, mapping, "transitions") || data.transitions || [];

  return {
    states: states.map((state: any) => ({
      id: state.id,
      label: state.label || state.name || String(state.id),
      type: state.type,
      ...state,
    })),
    transitions: transitions.map((trans: any) => ({
      from: trans.from || trans.source,
      to: trans.to || trans.target,
      condition: trans.condition,
      action: trans.action,
      label: trans.label,
      ...trans,
    })),
    currentState: data.currentState,
  };
}

export function normalizeParticleData(data: any, mapping?: any): any {
  const particles =
    applyDataMapping(data, mapping, "particles") || data.particles || data;

  if (!Array.isArray(particles)) {
    return { particles: [] };
  }

  return {
    particles: particles.map((p: any, idx: number) => ({
      id: p.id || idx,
      position: p.position || { x: 0, y: 0 },
      velocity: p.velocity || { x: 0, y: 0 },
      acceleration: p.acceleration || { x: 0, y: 0 },
      ...p,
    })),
  };
}
