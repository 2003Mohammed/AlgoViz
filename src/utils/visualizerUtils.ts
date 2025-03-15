
import { ArrayItem, GraphData, TreeNode, GraphNode, GraphEdge, NodeItem, EdgeItem } from '../types/visualizer';

// Status color mapping
export function getStatusColor(status: ArrayItem['status']) {
  switch (status) {
    case 'comparing':
      return 'bg-yellow-400';
    case 'sorted':
      return 'bg-green-500';
    case 'pivot':
      return 'bg-purple-500';
    case 'current':
      return 'bg-blue-500';
    default:
      return 'bg-gray-300';
  }
}

// Generate random array for sorting/searching visualizations
export function generateRandomArray(sorted = false): ArrayItem[] {
  const length = Math.floor(Math.random() * 7) + 8;
  let values = Array.from({ length }, () => Math.floor(Math.random() * 90) + 10);
  
  if (sorted) {
    values.sort((a, b) => a - b);
  }
  
  return values.map(value => ({
    value,
    status: 'default' as const
  }));
}

// Generate random graph for graph algorithm visualizations
export function generateRandomGraph(): GraphData {
  const nodeCount = Math.floor(Math.random() * 4) + 6;
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Create nodes with proper typing
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI;
    const radius = 150;
    const x = 300 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    
    nodes.push({
      id: String.fromCharCode(65 + i),
      value: String.fromCharCode(65 + i),
      x,
      y,
      status: 'default' as const
    });
  }
  
  // Create edges (connected graph)
  for (let i = 0; i < nodeCount; i++) {
    // Connect to next node (circular)
    edges.push({
      source: nodes[i].id,
      target: nodes[(i + 1) % nodeCount].id,
      weight: Math.floor(Math.random() * 9) + 1,
      status: 'default' as const
    });
    
    // Add some random edges for a more connected graph
    if (Math.random() > 0.3) {
      const targetIdx = (i + 2 + Math.floor(Math.random() * (nodeCount - 3))) % nodeCount;
      
      // Avoid duplicate edges
      if (!edges.some(e => 
        (e.source === nodes[i].id && e.target === nodes[targetIdx].id) ||
        (e.source === nodes[targetIdx].id && e.target === nodes[i].id)
      )) {
        edges.push({
          source: nodes[i].id,
          target: nodes[targetIdx].id,
          weight: Math.floor(Math.random() * 9) + 1,
          status: 'default' as const
        });
      }
    }
  }
  
  return { nodes, edges };
}

// Generate random binary tree
export function generateRandomTree(): TreeNode {
  // Helper function to create a tree with given depth
  function createRandomTree(depth: number, prefix: string): TreeNode | null {
    if (depth <= 0) return null;
    
    const value = Math.floor(Math.random() * 90) + 10;
    const nodeId = `${prefix}-${value}`;
    
    // Make sure we explicitly use a valid status
    return {
      id: nodeId,
      value,
      status: 'default' as const,
      left: Math.random() > 0.3 ? createRandomTree(depth - 1, `${nodeId}-L`) : null,
      right: Math.random() > 0.3 ? createRandomTree(depth - 1, `${nodeId}-R`) : null
    };
  }
  
  // Create a root node with explicit status
  const rootValue = Math.floor(Math.random() * 90) + 10;
  const root: TreeNode = {
    id: `root-${rootValue}`,
    value: rootValue,
    status: 'default' as const,
    left: createRandomTree(2, `root-${rootValue}-L`),
    right: createRandomTree(2, `root-${rootValue}-R`)
  };
  
  return root;
}

// Convert tree to array form (for serialization)
export function treeToArray(root: TreeNode): (number | null)[] {
  const result: (number | null)[] = [];
  
  function traverse(node: TreeNode | null, index: number) {
    if (!node) return;
    
    // Ensure array is large enough
    while (result.length <= index) {
      result.push(null);
    }
    
    result[index] = node.value;
    
    // Traverse children
    if (node.left) traverse(node.left, 2 * index + 1);
    if (node.right) traverse(node.right, 2 * index + 2);
  }
  
  traverse(root, 0);
  return result;
}

// Convert array form back to tree
export function arrayToTree(arr: (number | null)[]): TreeNode | null {
  if (!arr.length || arr[0] === null) return null;
  
  function buildTree(index: number): TreeNode | null {
    if (index >= arr.length || arr[index] === null) return null;
    
    return {
      id: `node-${index}`,
      value: arr[index] as number,
      status: 'default' as const,
      left: buildTree(2 * index + 1),
      right: buildTree(2 * index + 2)
    };
  }
  
  return buildTree(0);
}
