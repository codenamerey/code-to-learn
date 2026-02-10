// Common visualizer template types

export type VisualizerTemplate =
  | "graph"
  | "tree"
  | "array"
  | "grid"
  | "chart"
  | "spatial"
  | "table"
  | "state-machine"
  | "particles";

export interface VisualizerConfig {
  template: VisualizerTemplate;
  dataMapping?: DataMapping;
  style?: StyleConfig;
  layout?: LayoutConfig;
  interactions?: InteractionConfig;
}

export interface DataMapping {
  // For graph templates
  nodes?: string; // path to nodes array in data
  edges?: string; // path to edges array in data
  nodeId?: string; // property name for node id
  nodeLabel?: string; // property name for node label
  edgeSource?: string; // property name for edge source
  edgeTarget?: string; // property name for edge target

  // For tree templates
  root?: string; // path to root node
  children?: string; // property name for children array

  // For array templates
  elements?: string; // path to elements array
  value?: string; // property name for element value
  state?: string; // property name for element state

  // For grid templates
  grid?: string; // path to 2D array or cells array
  rows?: string; // property name for rows
  cols?: string; // property name for cols

  // For chart templates
  series?: string; // path to data series
  xAxis?: string; // property name for x values
  yAxis?: string; // property name for y values

  // For spatial templates
  objects?: string; // path to objects array
  position?: string; // property name for position object

  // Generic
  label?: string; // property name for labels
  type?: string; // property name for type/category
  properties?: string[]; // additional properties to display
}

export interface StyleConfig {
  // Colors
  colorScheme?: "default" | "chemistry" | "biology" | "physics" | "math" | "cs";
  nodeColor?: string | ((node: any) => string);
  edgeColor?: string | ((edge: any) => string);
  highlightColor?: string;

  // Sizes
  nodeSize?: number | ((node: any) => number);
  edgeWidth?: number | ((edge: any) => number);
  fontSize?: number;

  // Shapes
  nodeShape?: "circle" | "square" | "diamond" | "triangle";
  edgeStyle?: "line" | "arrow" | "dashed" | "curved";

  // Display options
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export interface LayoutConfig {
  // For graph layouts
  type?: "force-directed" | "hierarchical" | "circular" | "grid" | "manual";
  spacing?: number;
  centerX?: number;
  centerY?: number;

  // For specific layout types
  forceStrength?: number;
  linkDistance?: number;
  hierarchyDirection?: "top-down" | "bottom-up" | "left-right" | "right-left";

  // General
  width?: number;
  height?: number;
  padding?: number;
}

export interface InteractionConfig {
  zoomable?: boolean;
  pannable?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  draggable?: boolean;
}

// Data type interfaces for templates
export interface GraphData {
  nodes: Array<{
    id: string | number;
    label?: string;
    x?: number;
    y?: number;
    type?: string;
    [key: string]: any;
  }>;
  edges: Array<{
    source: string | number;
    target: string | number;
    weight?: number;
    label?: string;
    type?: string;
    [key: string]: any;
  }>;
}

export interface TreeData {
  id: string | number;
  value?: any;
  label?: string;
  children?: TreeData[];
  [key: string]: any;
}

export interface ArrayData {
  elements: Array<{
    value: any;
    index?: number;
    state?: string;
    highlight?: boolean;
    [key: string]: any;
  }>;
  currentOperation?: string;
}

export interface GridData {
  grid: any[][];
  dimensions?: { rows: number; cols: number };
  [key: string]: any;
}

export interface ChartData {
  series: Array<{
    x: number | string;
    y: number;
    label?: string;
    [key: string]: any;
  }>;
  metadata?: {
    xLabel?: string;
    yLabel?: string;
    title?: string;
    [key: string]: any;
  };
}

export interface SpatialData {
  objects: Array<{
    id?: string | number;
    position: { x: number; y: number; z?: number };
    type?: string;
    shape?: string;
    [key: string]: any;
  }>;
}

export interface StateMachineData {
  states: Array<{
    id: string | number;
    label: string;
    type?: string;
    [key: string]: any;
  }>;
  transitions: Array<{
    from: string | number;
    to: string | number;
    condition?: string;
    action?: string;
    [key: string]: any;
  }>;
  currentState?: string | number;
}

export interface ParticleData {
  particles: Array<{
    id: string | number;
    position: { x: number; y: number; z?: number };
    velocity?: { x: number; y: number; z?: number };
    acceleration?: { x: number; y: number; z?: number };
    [key: string]: any;
  }>;
}
