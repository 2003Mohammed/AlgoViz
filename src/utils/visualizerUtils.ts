import { ArrayItem, GraphData, TreeNode } from '../types/visualizer';

export function generateRandomArray(sorted = false, size = 12, min = 1, max = 100): ArrayItem[] {
  const array = Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    status: 'default' as const,
  }));

  if (sorted) {
    array.sort((a, b) => a.value - b.value);
  }

  return array;
}

export function generateRandomGraph(nodeCount = 6): GraphData {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 420 + 40,
    y: Math.random() * 280 + 40,
    value: i + 1,
    status: 'default' as const,
  }));

  const edges: GraphData['edges'] = [];
  const edgeSet = new Set<string>();
  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const key = [Math.min(a, b), Math.max(a, b)].join('-');
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({
      source: `node-${a}`,
      target: `node-${b}`,
      weight: Math.floor(Math.random() * 9) + 1,
      status: 'default' as const,
    });
  };

  // Always create a spanning tree to ensure graph is connected.
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i);
    addEdge(parent, i);
  }

  // Add extra edges for richness.
  const desiredEdges = Math.max(nodeCount + 2, Math.floor(nodeCount * 1.7));
  while (edges.length < desiredEdges) {
    addEdge(Math.floor(Math.random() * nodeCount), Math.floor(Math.random() * nodeCount));
  }

  return { nodes, edges };
}

export function generateRandomTree(depth = 3, maxValue = 100): TreeNode {
  function createNode(currentDepth: number): TreeNode | null {
    if (currentDepth > depth || Math.random() < 0.25) {
      return null;
    }

    return {
      id: `node-${Math.random().toString(36).slice(2, 9)}`,
      value: Math.floor(Math.random() * maxValue) + 1,
      left: createNode(currentDepth + 1),
      right: createNode(currentDepth + 1),
      status: 'default',
    };
  }

  return (
    createNode(0) || {
      id: 'root',
      value: 50,
      left: null,
      right: null,
      status: 'default',
    }
  );
}
