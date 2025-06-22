
import { ArrayItem, GraphData, TreeNode } from '../types/visualizer';

export function generateRandomArray(sorted = false, size = 12, min = 1, max = 100): ArrayItem[] {
  const array = Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    status: 'default' as const
  }));
  
  if (sorted) {
    array.sort((a, b) => a.value - b.value);
  }
  
  return array;
}

export function generateRandomGraph(nodeCount = 6): GraphData {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 400 + 50,
    y: Math.random() * 300 + 50,
    value: i + 1,
    status: 'default' as const
  }));
  
  const edges = [];
  const maxEdges = Math.floor(nodeCount * 1.5);
  const edgeSet = new Set<string>();
  
  for (let i = 0; i < maxEdges; i++) {
    const source = Math.floor(Math.random() * nodeCount);
    const target = Math.floor(Math.random() * nodeCount);
    
    if (source !== target) {
      const edgeKey = `${source}-${target}`;
      const reverseKey = `${target}-${source}`;
      
      if (!edgeSet.has(edgeKey) && !edgeSet.has(reverseKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          source: `node-${source}`,
          target: `node-${target}`,
          weight: Math.floor(Math.random() * 10) + 1,
          status: 'default' as const
        });
      }
    }
  }
  
  return { nodes, edges };
}

export function generateRandomTree(depth = 3, maxValue = 100): TreeNode {
  function createNode(currentDepth: number): TreeNode | null {
    if (currentDepth > depth || Math.random() < 0.3) {
      return null;
    }
    
    return {
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
      value: Math.floor(Math.random() * maxValue) + 1,
      left: createNode(currentDepth + 1),
      right: createNode(currentDepth + 1),
      status: 'default'
    };
  }
  
  return createNode(0) || {
    id: 'root',
    value: 50,
    left: null,
    right: null,
    status: 'default'
  };
}
