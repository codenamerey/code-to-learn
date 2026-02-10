# Example: AI-Generated Course with Visualizer

This example demonstrates what the AI would generate for a "Binary Search Tree" course with the new template visualizer system.

## Example JSON Output from AI

```json
{
  "courseTitle": "Understanding Binary Search Trees",
  "courseSlug": "understanding-binary-search-trees",
  "description": "Learn to implement and manipulate binary search trees through hands-on coding.",
  "lessons": [
    {
      "lessonTitle": "Building a Binary Search Tree",
      "lesson": "# Building a Binary Search Tree\n\n## Learning Objectives\n- Understand BST structure\n- Learn to insert nodes\n- Maintain BST property\n\n## Your Challenge\nImplement a function that builds a BST from an array of values.",
      "code": "function buildBST(values) {\n  // Create a new tree\n  // Insert each value maintaining BST property\n  // Return the tree\n  return tree;\n}",
      "abstracted": "class TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n    this.id = TreeNode.idCounter++;\n  }\n}\n\nTreeNode.idCounter = 0;\n\nclass BinarySearchTree {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    const newNode = new TreeNode(value);\n    if (!this.root) {\n      this.root = newNode;\n      return this;\n    }\n    let current = this.root;\n    while (true) {\n      if (value < current.value) {\n        if (!current.left) {\n          current.left = newNode;\n          return this;\n        }\n        current = current.left;\n      } else {\n        if (!current.right) {\n          current.right = newNode;\n          return this;\n        }\n        current = current.right;\n      }\n    }\n  }\n  \n  toGraphData() {\n    const nodes = [];\n    const edges = [];\n    \n    const traverse = (node) => {\n      if (!node) return;\n      \n      nodes.push({\n        id: node.id,\n        label: String(node.value),\n        value: node.value,\n        type: node === this.root ? 'root' : 'node'\n      });\n      \n      if (node.left) {\n        edges.push({\n          source: node.id,\n          target: node.left.id,\n          label: 'L'\n        });\n        traverse(node.left);\n      }\n      \n      if (node.right) {\n        edges.push({\n          source: node.id,\n          target: node.right.id,\n          label: 'R'\n        });\n        traverse(node.right);\n      }\n    };\n    \n    traverse(this.root);\n    return { nodes, edges };\n  }\n}",
      "documentationdata": [
        {
          "className": "BinarySearchTree",
          "description": "A binary search tree data structure",
          "usage": "const tree = new BinarySearchTree();\\ntree.insert(5);\\ntree.insert(3);",
          "methods": [
            {
              "method": "insert(value)",
              "description": "Inserts a value into the BST",
              "returnType": "BinarySearchTree"
            },
            {
              "method": "toGraphData()",
              "description": "Converts the tree to graph visualization data",
              "returnType": "Object"
            }
          ],
          "properties": [
            {
              "type": "Read-Only",
              "property": "root",
              "dataType": "TreeNode",
              "description": "The root node of the tree"
            }
          ]
        }
      ],
      "hints": [
        {
          "id": "hint-1",
          "title": "Creating the tree",
          "content": "Start by creating a new `BinarySearchTree` instance."
        },
        {
          "id": "hint-2",
          "title": "Inserting values",
          "content": "Use the `insert()` method for each value in the array."
        }
      ],
      "unittests": "function runTests(buildBST) {\n  const tests = [];\n  \n  // Test 1: Simple tree\n  const tree1 = buildBST([5, 3, 7]);\n  const data1 = tree1.toGraphData();\n  tests.push({\n    title: 'Build simple tree',\n    passed: data1.nodes.length === 3 && data1.edges.length === 2,\n    message: data1.nodes.length === 3 ? 'Correct!' : 'Expected 3 nodes, got ' + data1.nodes.length\n  });\n  \n  // Test 2: Larger tree\n  const tree2 = buildBST([5, 3, 7, 1, 4, 6, 9]);\n  const data2 = tree2.toGraphData();\n  tests.push({\n    title: 'Build larger tree',\n    passed: data2.nodes.length === 7,\n    message: data2.nodes.length === 7 ? 'Correct!' : 'Expected 7 nodes, got ' + data2.nodes.length\n  });\n  \n  return tests;\n}",
      "demodata": "const demoData = [[5, 3, 7, 1, 9, 4, 6]];",
      "visualizer": {
        "template": "graph",
        "dataMapping": {
          "nodes": "nodes",
          "edges": "edges",
          "nodeId": "id",
          "nodeLabel": "label",
          "edgeSource": "source",
          "edgeTarget": "target"
        },
        "style": {
          "colorScheme": "cs",
          "showLabels": true,
          "nodeShape": "circle",
          "edgeStyle": "arrow",
          "nodeColor": "#06B6D4"
        },
        "layout": {
          "type": "hierarchical",
          "spacing": 80
        }
      }
    }
  ]
}
```

## What This Achieves

1. **No Custom Code**: The AI doesn't generate visualization code, just configuration
2. **Type Safety**: All templates are pre-built and tested
3. **Flexibility**: Works across all domains (CS, Math, Physics, etc.)
4. **Consistency**: All visualizations follow the same patterns
5. **Maintainability**: Update templates in one place, affects all courses

## Student Experience

When the student completes the `buildBST` function and runs it:

1. The function executes with the demo data: `[5, 3, 7, 1, 9, 4, 6]`
2. The result is passed through `.toGraphData()` (from abstracted code)
3. The graph template receives:
   ```javascript
   {
     nodes: [
       { id: 0, label: "5", value: 5, type: "root" },
       { id: 1, label: "3", value: 3, type: "node" },
       { id: 2, label: "7", value: 7, type: "node" },
       // ...
     ],
     edges: [
       { source: 0, target: 1, label: "L" },
       { source: 0, target: 2, label: "R" },
       // ...
     ]
   }
   ```
4. The template renders a hierarchical tree visualization with:
   - Nodes shown as circles with values as labels
   - Edges shown as arrows (L for left, R for right)
   - Hierarchical layout (parent above children)
   - Computer science color scheme (cyan/blue)

## Future Course Examples

### Merge Sort (Array Template)

```json
{
  "visualizer": {
    "template": "array",
    "dataMapping": {
      "elements": "array"
    },
    "style": {
      "colorScheme": "cs",
      "showLabels": true
    }
  }
}
```

### Projectile Motion (Chart Template)

```json
{
  "visualizer": {
    "template": "chart",
    "dataMapping": {
      "series": "trajectory",
      "xAxis": "x",
      "yAxis": "y"
    },
    "style": {
      "colorScheme": "physics",
      "showGrid": true
    }
  }
}
```

### Pathfinding A\* (Grid Template)

```json
{
  "visualizer": {
    "template": "grid",
    "dataMapping": {
      "grid": "maze"
    },
    "style": {
      "showValues": false
    }
  }
}
```
