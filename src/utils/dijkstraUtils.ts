export interface DijkstraStep {
  nodes: any[];
  edges: any[];
  description: string;
  currentNode?: string;
  distances?: { [key: string]: number };
}

export interface DijkstraResult {
  path: string[];
  cost: number;
  steps: DijkstraStep[];
}

// 🔥 STRICT: Dijkstra's algorithm with step-by-step visualization
export async function runDijkstraVisual(
  graph: { nodes: any[], edges: any[] }, 
  start: string, 
  end: string, 
  highlightFn?: (nodeId: string) => Promise<void>
): Promise<DijkstraResult> {
  const steps: DijkstraStep[] = [];
  const visited = new Set<string>();
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  
  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === start ? 0 : Infinity;
    previous[node.id] = null;
  });
  
  // Initial state
  steps.push({
    nodes: graph.nodes.map(node => ({ 
      ...node, 
      status: node.id === start ? 'current' : 'default' 
    })),
    edges: graph.edges.map(edge => ({ ...edge, status: 'default' })),
    description: `Starting Dijkstra's algorithm from ${start}`,
    currentNode: start,
    distances: { ...distances }
  });
  
  while (true) {
    // Find unvisited node with minimum distance
    const current = Object.keys(distances)
      .filter(nodeId => !visited.has(nodeId))
      .sort((a, b) => distances[a] - distances[b])[0];
    
    if (!current || distances[current] === Infinity) break;
    
    visited.add(current);
    
    // Highlight current node
    if (highlightFn) {
      await highlightFn(current);
    }
    
    steps.push({
      nodes: graph.nodes.map(node => ({
        ...node,
        status: node.id === current ? 'visiting' : 
                visited.has(node.id) ? 'visited' : 'default'
      })),
      edges: graph.edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Processing node ${current} (distance: ${distances[current]})`,
      currentNode: current,
      distances: { ...distances }
    });
    
    // If we reached the destination
    if (current === end) break;
    
    // Update distances to neighbors
    const neighbors = graph.edges
      .filter(edge => edge.source === current || edge.target === current)
      .map(edge => ({
        nodeId: edge.source === current ? edge.target : edge.source,
        weight: edge.weight || 1
      }))
      .filter(neighbor => !visited.has(neighbor.nodeId));
    
    neighbors.forEach(neighbor => {
      const newDistance = distances[current] + neighbor.weight;
      if (newDistance < distances[neighbor.nodeId]) {
        distances[neighbor.nodeId] = newDistance;
        previous[neighbor.nodeId] = current;
        
        steps.push({
          nodes: graph.nodes.map(node => ({
            ...node,
            status: node.id === neighbor.nodeId ? 'processing' : 
                    node.id === current ? 'visiting' :
                    visited.has(node.id) ? 'visited' : 'default'
          })),
          edges: graph.edges.map(edge => ({
            ...edge,
            status: (edge.source === current && edge.target === neighbor.nodeId) ||
                    (edge.target === current && edge.source === neighbor.nodeId) 
                    ? 'active' : 'default'
          })),
          description: `Updated distance to ${neighbor.nodeId}: ${newDistance}`,
          currentNode: current,
          distances: { ...distances }
        });
      }
    });
  }
  
  // Reconstruct path
  const path: string[] = [];
  let currentNode: string | null = end;
  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }
  
  // Highlight final path
  steps.push({
    nodes: graph.nodes.map(node => ({
      ...node,
      status: path.includes(node.id) ? 'path' : 'visited'
    })),
    edges: graph.edges.map(edge => ({
      ...edge,
      status: (path.includes(edge.source) && path.includes(edge.target)) ? 'path' : 'default'
    })),
    description: `Shortest path found: ${path.join(' → ')} | Total cost: ${distances[end]}`,
    currentNode: end,
    distances: { ...distances }
  });
  
  return {
    path,
    cost: distances[end] === Infinity ? -1 : distances[end],
    steps
  };
}

// 🔥 STRICT: Create connected graph with minimum 5 nodes
export function generateConnectedGraph(): { nodes: any[], edges: any[] } {
  const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const numNodes = 5 + Math.floor(Math.random() * 3); // 5-7 nodes
  
  const nodes = nodeLabels.slice(0, numNodes).map((label, index) => ({
    id: label,
    x: 100 + (index % 3) * 150,
    y: 80 + Math.floor(index / 3) * 120,
    status: 'default'
  }));
  
  const edges: any[] = [];
  
  // Ensure connectivity - create spanning tree first
  for (let i = 0; i < numNodes - 1; i++) {
    edges.push({
      source: nodeLabels[i],
      target: nodeLabels[i + 1],
      weight: Math.floor(Math.random() * 10) + 1,
      status: 'default'
    });
  }
  
  // Add random additional edges
  const additionalEdges = Math.floor(Math.random() * 3) + 2; // 2-4 additional edges
  for (let i = 0; i < additionalEdges; i++) {
    const source = nodeLabels[Math.floor(Math.random() * numNodes)];
    const target = nodeLabels[Math.floor(Math.random() * numNodes)];
    
    if (source !== target && !edges.some(e => 
      (e.source === source && e.target === target) || 
      (e.source === target && e.target === source)
    )) {
      edges.push({
        source,
        target,
        weight: Math.floor(Math.random() * 10) + 1,
        status: 'default'
      });
    }
  }
  
  return { nodes, edges };
}