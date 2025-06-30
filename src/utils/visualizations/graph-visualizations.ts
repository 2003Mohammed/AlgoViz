
import { VisualizationStep } from '../../types/visualizer';

interface GraphNode {
  id: string;
  visited?: boolean;
  distance?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

// Breadth-First Search Visualization
export function visualizeBFS(startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Simple graph for demonstration
  const nodes: GraphNode[] = [
    { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }
  ];
  
  const edges: GraphEdge[] = [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'C', target: 'E' }
  ];
  
  steps.push({
    array: [{ value: 'Starting BFS', status: 'default' }],
    lineIndex: 0,
    description: `Starting BFS from node ${startNode}`
  });
  
  // Simulate BFS traversal
  const visited = new Set<string>();
  const queue = [startNode];
  let stepCount = 1;
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      steps.push({
        array: [{ value: `Visit ${currentNode}`, status: 'found' }],
        lineIndex: stepCount,
        description: `Visiting node ${currentNode}`
      });
      
      // Add neighbors to queue (simplified)
      edges.forEach(edge => {
        if (edge.source === currentNode && !visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
      
      stepCount++;
    }
  }
  
  return steps;
}

// Depth-First Search Visualization
export function visualizeDFS(startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: [{ value: 'Starting DFS', status: 'default' }],
    lineIndex: 0,
    description: `Starting DFS from node ${startNode}`
  });
  
  // Simulate DFS traversal
  const visited = new Set<string>();
  const stack = [startNode];
  let stepCount = 1;
  
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      steps.push({
        array: [{ value: `Visit ${currentNode}`, status: 'found' }],
        lineIndex: stepCount,
        description: `Visiting node ${currentNode}`
      });
      
      stepCount++;
    }
  }
  
  return steps;
}

// Dijkstra's Algorithm Visualization
export function visualizeDijkstra(startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: [{ value: 'Dijkstra Start', status: 'default' }],
    lineIndex: 0,
    description: `Finding shortest paths from ${startNode}`
  });
  
  // Simplified Dijkstra simulation
  const nodes = ['A', 'B', 'C', 'D'];
  const distances = { A: 0, B: Infinity, C: Infinity, D: Infinity };
  
  nodes.forEach((node, index) => {
    const dist = node === startNode ? 0 : Math.floor(Math.random() * 10) + 1;
    steps.push({
      array: [{ value: `${node}: ${dist}`, status: node === startNode ? 'found' : 'comparing' }],
      lineIndex: index + 1,
      description: `Distance to ${node}: ${dist}`
    });
  });
  
  return steps;
}
