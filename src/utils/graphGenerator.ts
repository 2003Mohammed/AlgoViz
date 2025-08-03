// Enhanced graph generation utilities with realistic examples

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  status?: 'default' | 'visited' | 'processing' | 'path' | 'found' | 'current';
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  status?: 'default' | 'visited' | 'path' | 'highlighted';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  type: 'social' | 'transport' | 'network' | 'dependency';
}

// Social network examples
const socialNetworkExamples = [
  {
    nodes: [
      { id: 'Alice', x: 150, y: 100, label: 'Alice' },
      { id: 'Bob', x: 300, y: 50, label: 'Bob' },
      { id: 'Charlie', x: 350, y: 150, label: 'Charlie' },
      { id: 'Diana', x: 250, y: 200, label: 'Diana' },
      { id: 'Eve', x: 100, y: 200, label: 'Eve' },
      { id: 'Frank', x: 200, y: 120, label: 'Frank' }
    ],
    edges: [
      { source: 'Alice', target: 'Bob', weight: 1 },
      { source: 'Alice', target: 'Frank', weight: 1 },
      { source: 'Bob', target: 'Charlie', weight: 1 },
      { source: 'Charlie', target: 'Diana', weight: 1 },
      { source: 'Diana', target: 'Eve', weight: 1 },
      { source: 'Eve', target: 'Alice', weight: 1 },
      { source: 'Frank', target: 'Diana', weight: 1 }
    ],
    type: 'social' as const
  },
  {
    nodes: [
      { id: 'John', x: 120, y: 80, label: 'John' },
      { id: 'Sarah', x: 280, y: 60, label: 'Sarah' },
      { id: 'Mike', x: 350, y: 140, label: 'Mike' },
      { id: 'Lisa', x: 220, y: 180, label: 'Lisa' },
      { id: 'Tom', x: 80, y: 180, label: 'Tom' },
      { id: 'Anna', x: 180, y: 120, label: 'Anna' }
    ],
    edges: [
      { source: 'John', target: 'Sarah', weight: 1 },
      { source: 'John', target: 'Anna', weight: 1 },
      { source: 'Sarah', target: 'Mike', weight: 1 },
      { source: 'Mike', target: 'Lisa', weight: 1 },
      { source: 'Lisa', target: 'Tom', weight: 1 },
      { source: 'Tom', target: 'John', weight: 1 },
      { source: 'Anna', target: 'Lisa', weight: 1 },
      { source: 'Sarah', target: 'Anna', weight: 1 }
    ],
    type: 'social' as const
  }
];

// Transport/Route map examples
const transportExamples = [
  {
    nodes: [
      { id: 'A', x: 100, y: 100, label: 'City A' },
      { id: 'B', x: 250, y: 80, label: 'City B' },
      { id: 'C', x: 350, y: 120, label: 'City C' },
      { id: 'D', x: 300, y: 200, label: 'City D' },
      { id: 'E', x: 150, y: 180, label: 'City E' },
    ],
    edges: [
      { source: 'A', target: 'B', weight: 5 },
      { source: 'A', target: 'E', weight: 3 },
      { source: 'B', target: 'C', weight: 4 },
      { source: 'B', target: 'D', weight: 6 },
      { source: 'C', target: 'D', weight: 2 },
      { source: 'E', target: 'D', weight: 4 }
    ],
    type: 'transport' as const
  },
  {
    nodes: [
      { id: 'Home', x: 80, y: 120, label: 'Home' },
      { id: 'Mall', x: 200, y: 60, label: 'Mall' },
      { id: 'Office', x: 320, y: 100, label: 'Office' },
      { id: 'Gym', x: 280, y: 180, label: 'Gym' },
      { id: 'Park', x: 140, y: 200, label: 'Park' },
      { id: 'School', x: 360, y: 160, label: 'School' }
    ],
    edges: [
      { source: 'Home', target: 'Mall', weight: 7 },
      { source: 'Home', target: 'Park', weight: 3 },
      { source: 'Mall', target: 'Office', weight: 5 },
      { source: 'Office', target: 'School', weight: 2 },
      { source: 'Office', target: 'Gym', weight: 4 },
      { source: 'Gym', target: 'Park', weight: 6 },
      { source: 'Park', target: 'Home', weight: 3 }
    ],
    type: 'transport' as const
  }
];

// Network topology examples
const networkExamples = [
  {
    nodes: [
      { id: 'Router', x: 200, y: 100, label: 'Router' },
      { id: 'Server1', x: 100, y: 50, label: 'Server 1' },
      { id: 'Server2', x: 300, y: 50, label: 'Server 2' },
      { id: 'PC1', x: 80, y: 180, label: 'PC 1' },
      { id: 'PC2', x: 200, y: 200, label: 'PC 2' },
      { id: 'PC3', x: 320, y: 180, label: 'PC 3' }
    ],
    edges: [
      { source: 'Router', target: 'Server1', weight: 10 },
      { source: 'Router', target: 'Server2', weight: 10 },
      { source: 'Router', target: 'PC1', weight: 1 },
      { source: 'Router', target: 'PC2', weight: 1 },
      { source: 'Router', target: 'PC3', weight: 1 },
      { source: 'Server1', target: 'Server2', weight: 8 }
    ],
    type: 'network' as const
  }
];

// Dependency graph examples
const dependencyExamples = [
  {
    nodes: [
      { id: 'App', x: 200, y: 50, label: 'App' },
      { id: 'UI', x: 120, y: 120, label: 'UI' },
      { id: 'API', x: 280, y: 120, label: 'API' },
      { id: 'DB', x: 280, y: 200, label: 'Database' },
      { id: 'Auth', x: 120, y: 200, label: 'Auth' },
      { id: 'Utils', x: 200, y: 170, label: 'Utils' }
    ],
    edges: [
      { source: 'App', target: 'UI', weight: 1 },
      { source: 'App', target: 'API', weight: 1 },
      { source: 'UI', target: 'Auth', weight: 1 },
      { source: 'UI', target: 'Utils', weight: 1 },
      { source: 'API', target: 'DB', weight: 1 },
      { source: 'API', target: 'Utils', weight: 1 },
      { source: 'Auth', target: 'Utils', weight: 1 }
    ],
    type: 'dependency' as const
  }
];

// Generate a random graph example
export function generateRandomGraph(): GraphData {
  const allExamples = [
    ...socialNetworkExamples,
    ...transportExamples,
    ...networkExamples,
    ...dependencyExamples
  ];
  
  const randomExample = allExamples[Math.floor(Math.random() * allExamples.length)];
  
  // Deep clone and add default status
  return {
    nodes: randomExample.nodes.map(node => ({ ...node, status: 'default' })),
    edges: randomExample.edges.map(edge => ({ ...edge, status: 'default' })),
    type: randomExample.type
  };
}

// Generate traversal steps for BFS/DFS
export function getGraphTraversalSteps(graph: GraphData, startNodeId: string, traversalType: 'bfs' | 'dfs') {
  const steps: Array<{ nodes: GraphNode[], edges: GraphEdge[], description: string }> = [];
  const { nodes, edges } = graph;
  
  // Create adjacency list
  const adjacencyList: { [key: string]: string[] } = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    adjacencyList[edge.target].push(edge.source); // Undirected graph
  });
  
  // Initial state
  const workingNodes = nodes.map(n => ({ ...n, status: 'default' as GraphNode['status'] }));
  const workingEdges = edges.map(e => ({ ...e, status: 'default' as GraphEdge['status'] }));
  
  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    edges: workingEdges.map(e => ({ ...e })),
    description: `Starting ${traversalType.toUpperCase()} from ${startNodeId}`
  });
  
  const visited = new Set<string>();
  const queue = [startNodeId];
  
  while (queue.length > 0) {
    const currentNodeId = traversalType === 'bfs' ? queue.shift()! : queue.pop()!;
    
    if (visited.has(currentNodeId)) continue;
    
    // Mark current node as processing
    const currentNodeIndex = workingNodes.findIndex(n => n.id === currentNodeId);
    if (currentNodeIndex !== -1) {
      workingNodes[currentNodeIndex].status = 'processing';
    }
    
    steps.push({
      nodes: workingNodes.map(n => ({ ...n })),
      edges: workingEdges.map(e => ({ ...e })),
      description: `Processing node: ${currentNodeId}`
    });
    
    visited.add(currentNodeId);
    if (currentNodeIndex !== -1) {
      workingNodes[currentNodeIndex].status = 'visited';
    }
    
    // Add neighbors to queue
    const neighbors = adjacencyList[currentNodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        
        // Highlight edge
        const edgeIndex = workingEdges.findIndex(e => 
          (e.source === currentNodeId && e.target === neighbor) ||
          (e.source === neighbor && e.target === currentNodeId)
        );
        if (edgeIndex !== -1) {
          workingEdges[edgeIndex].status = 'visited';
        }
      }
    }
    
    steps.push({
      nodes: workingNodes.map(n => ({ ...n })),
      edges: workingEdges.map(e => ({ ...e })),
      description: `Added neighbors of ${currentNodeId} to queue`
    });
  }
  
  // Final state
  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    edges: workingEdges.map(e => ({ ...e })),
    description: `${traversalType.toUpperCase()} traversal completed!`
  });
  
  return steps;
}