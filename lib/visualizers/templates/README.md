# Template-Based Visualizer System

## Overview

This system allows AI-generated courses to include dynamic visualizations without generating custom code. Instead, the AI configures pre-built visualization templates that can handle **any data type** - from simple primitives (strings, numbers, booleans) to complex structures (graphs, arrays, grids).

### Key Features

✅ **Universal Support** - Works with ALL return types (primitives AND structured data)  
✅ **Automatic Adaptation** - Intelligently wraps primitives into visualizable structures  
✅ **Template-Based** - No code generation, just configuration  
✅ **Domain-Specific** - Color schemes for Chemistry, Biology, Physics, Math, CS  
✅ **Flexible Layouts** - Force-directed, circular, hierarchical, grid layouts

### Primitive Value Support (NEW!)

The system now automatically handles primitive return values:

- **Strings** → Visualized as character array (e.g., "ACGT" → [A][C][G][T])
- **Numbers** → Visualized as property table (e.g., 42 → Value: 42)
- **Booleans** → Visualized as property table (e.g., true → Result: true)

See [PRIMITIVE_SUPPORT.md](./PRIMITIVE_SUPPORT.md) for detailed documentation.

## Available Templates

### 1. **Graph Template** (`"graph"`)

Visualizes node-edge networks using force-directed or other layouts.

**Use Cases:**

- Chemistry: Molecular structures (atoms as nodes, bonds as edges)
- Computer Science: Graph algorithms, trees, network topologies
- Biology: Neural networks, food webs, phylogenetic trees
- Math: Graph theory problems
- Physics: Circuit diagrams, particle interactions

**Data Shape:**

```javascript
{
  nodes: [
    { id: "1", label: "Node 1", type: "type1", x: 100, y: 100 },
    // ... more nodes
  ],
  edges: [
    { source: "1", target: "2", weight: 1, label: "edge" },
    // ... more edges
  ]
}
```

**Configuration Example:**

```json
{
  "template": "graph",
  "dataMapping": {
    "nodes": "atoms",
    "edges": "bonds",
    "nodeId": "uuid",
    "nodeLabel": "name"
  },
  "style": {
    "colorScheme": "chemistry",
    "showLabels": true,
    "nodeShape": "circle",
    "edgeStyle": "line"
  },
  "layout": {
    "type": "force-directed",
    "linkDistance": 100
  }
}
```

### 2. **Array Template** (`"array"`)

Visualizes arrays and sequences, great for sorting algorithms.

**Use Cases:**

- Computer Science: Sorting algorithms, array operations
- Math: Sequences, vectors
- Biology: DNA sequences, protein chains

**Data Shape:**

```javascript
{
  elements: [
    { value: 5, index: 0, state: "comparing" },
    { value: 3, index: 1, state: "sorted" },
    // ... more elements
  ],
  currentOperation: "Comparing elements..."
}
```

**Configuration Example:**

```json
{
  "template": "array",
  "dataMapping": {
    "elements": "arr",
    "value": "val"
  },
  "style": {
    "showLabels": true,
    "showValues": true
  }
}
```

### 3. **Chart Template** (`"chart"`)

Line/scatter plots for time series and functions.

**Use Cases:**

- Physics: Motion graphs, oscillations
- Math: Function plotting, derivatives
- Biology: Population dynamics, reaction kinetics
- Chemistry: Reaction rates, titration curves

**Data Shape:**

```javascript
{
  series: [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    // ... more points
  ],
  metadata: {
    title: "Position vs Time",
    xLabel: "Time (s)",
    yLabel: "Position (m)"
  }
}
```

**Configuration Example:**

```json
{
  "template": "chart",
  "dataMapping": {
    "series": "points",
    "xAxis": "time",
    "yAxis": "position"
  },
  "style": {
    "showGrid": true,
    "edgeColor": "#3B82F6"
  }
}
```

### 4. **Grid Template** (`"grid"`)

2D matrix/grid visualization.

**Use Cases:**

- Computer Science: Pathfinding (A\*), dynamic programming tables
- Math: Matrices, game of life
- Physics: Heat maps, field simulations
- Biology: Population grids, Punnett squares

**Data Shape:**

```javascript
{
  grid: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  dimensions: { rows: 3, cols: 3 }
}
// OR with cell objects:
{
  grid: [
    { row: 0, col: 0, value: 1, state: "start" },
    { row: 0, col: 1, value: 2, state: "path" },
    // ...
  ]
}
```

**Configuration Example:**

```json
{
  "template": "grid",
  "dataMapping": {
    "grid": "matrix"
  },
  "style": {
    "showValues": true
  }
}
```

### 5. **Table Template** (`"table"`)

Structured data in tabular format.

**Use Cases:**

- General: Properties, comparisons, test results
- Chemistry: Element properties
- Biology: Species characteristics
- Any domain: Data tables, results

**Data Shape:**

```javascript
[
  { name: "Item 1", value: 10, state: "active" },
  { name: "Item 2", value: 20, state: "inactive" },
  // ... more rows
];
```

**Configuration Example:**

```json
{
  "template": "table",
  "dataMapping": {
    "properties": ["name", "value", "state"]
  },
  "style": {
    "showValues": true
  }
}
```

## How to Use in AI Course Generation

When the `includeVisualizer` flag is set to `true`, the AI should include a `visualizer` object in each lesson:

```json
{
  "lessonTitle": "Merge Sort Visualization",
  "lesson": "...",
  "code": "...",
  "abstracted": "...",
  "documentationdata": [...],
  "hints": [...],
  "unittests": "...",
  "demodata": "...",
  "visualizer": {
    "template": "array",
    "dataMapping": {
      "elements": "sortedArray",
      "value": "value",
      "state": "state"
    },
    "style": {
      "colorScheme": "cs",
      "showLabels": true,
      "showValues": true
    }
  }
}
```

## Data Mapping

The `dataMapping` object tells the template where to find data in the student's function output:

- Use dot notation for nested paths: `"atoms.list"`
- Specify property names for extraction: `"nodeId": "uuid"` means use the `uuid` property as the node ID
- Leave undefined to use default property names

## Style Configuration

Common style options:

- `colorScheme`: `"chemistry"`, `"biology"`, `"physics"`, `"math"`, `"cs"`, or `"default"`
- `showLabels`: boolean - show text labels
- `showValues`: boolean - show numeric values/metadata
- `showGrid`: boolean - show grid lines (for charts)
- `nodeShape`: `"circle"`, `"square"`, `"diamond"`, `"triangle"`
- `edgeStyle`: `"line"`, `"arrow"`, `"dashed"`, `"curved"`
- `nodeColor`: string or function reference
- `nodeSize`: number
- `fontSize`: number

## Layout Configuration

For graph templates:

- `type`: `"force-directed"`, `"hierarchical"`, `"circular"`, `"grid"`, or `"manual"`
- `linkDistance`: number - distance between connected nodes
- `forceStrength`: number - strength of repulsion forces
- `spacing`: number - spacing between elements
- `padding`: number - padding from edges

## Template Selection Guide

| Domain           | Topic                | Recommended Template |
| ---------------- | -------------------- | -------------------- |
| Chemistry        | Molecular structures | `graph`              |
| Chemistry        | Reaction rates       | `chart`              |
| Computer Science | Sorting algorithms   | `array`              |
| Computer Science | Graph algorithms     | `graph`              |
| Computer Science | Pathfinding          | `grid`               |
| Math             | Functions            | `chart`              |
| Math             | Matrices             | `grid`               |
| Math             | Graph theory         | `graph`              |
| Physics          | Kinematics           | `chart`              |
| Physics          | Forces               | `graph` or `chart`   |
| Biology          | Phylogenetic trees   | `graph`              |
| Biology          | Population dynamics  | `chart`              |
| Biology          | Genetic crosses      | `grid` or `table`    |

## Implementation Details

The template system is located in:

- `/lib/visualizers/templates/` - Template components
- `/lib/visualizers/templates/types.ts` - TypeScript interfaces
- `/lib/visualizers/templates/utils.ts` - Data normalization utilities
- `/lib/visualizers/templates/TemplateRenderer.tsx` - Main renderer component

Templates are automatically selected based on the `template` field in the visualizer config and render the student's function output according to the configuration.

## Future Templates

Coming soon:

- `tree` - Hierarchical tree structures
- `spatial` - 3D spatial objects
- `state-machine` - State transition diagrams
- `particles` - Particle systems with physics

## Example: Complete Lesson with Visualizer

```json
{
  "lessonTitle": "Building a Molecular Structure",
  "visualizer": {
    "template": "graph",
    "dataMapping": {
      "nodes": "atoms",
      "edges": "bonds",
      "nodeId": "uuid",
      "nodeLabel": "name",
      "edgeSource": "atom1",
      "edgeTarget": "atom2"
    },
    "style": {
      "colorScheme": "chemistry",
      "showLabels": true,
      "nodeShape": "circle",
      "edgeStyle": "line"
    },
    "layout": {
      "type": "force-directed",
      "linkDistance": 100,
      "forceStrength": 0.1
    }
  }
}
```

The student's function should return data matching the expected shape, and the template will automatically visualize it.
