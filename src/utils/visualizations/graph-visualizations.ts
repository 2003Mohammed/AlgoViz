
import { VisualizationStep } from '../../types/visualizer';

// Enhanced BFS Visualization with proper multi-node graph
export function visualizeBFS(startNode: string = 'A'): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Create a proper graph with multiple nodes and edges
  const graphData = {
    nodes: [
      { id: 'A', x: 100, y: 100, status: 'default' },
      { id: 'B', x: 200, y: 50, status: 'default' },
      { id: 'C', x: 300, y: 100, status: 'default' },
      { id: 'D', x: 200, y: 150, status: 'default' },
      { id: 'E', x: 150, y: 200, status: 'default' },
      { id: 'F', x: 250, y: 200, status: 'default' }
    ],
    edges: [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'D', status: 'default' },
      { source: 'B', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'C', target: 'F', status: 'default' },
      { source: 'D', target: 'E', status: 'default' },
      { source: 'E', target: 'F', status: 'default' }
    ]
  };

  // Initial state
  steps.push({
    array: [{ value: 'BFS Starting', status: 'default' }],
    lineIndex: 0,
    graphData: { ...graphData },
    description: `Starting BFS from node ${startNode}`
  });
  
  // Simulate BFS traversal
  const visited = new Set<string>();
  const queue = [startNode];
  let stepIndex = 1;
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      // Update node status to visited
      const updatedGraphData = {
        nodes: graphData.nodes.map(node => ({
          ...node,
          status: visited.has(node.id) ? 'visited' : 
                  node.id === currentNode ? 'processing' : 'default'
        })),
        edges: graphData.edges.map(edge => ({
          ...edge,
          status: (visited.has(edge.source) && visited.has(edge.target)) ? 'visited' : 'default'
        }))
      };
      
      steps.push({
        array: [{ value: `Visiting ${currentNode}`, status: 'found' }],
        lineIndex: stepIndex,
        graphData: updatedGraphData,
        description: `Visiting node ${currentNode}`
      });
      
      // Add neighbors to queue
      const neighbors = graphData.edges
        .filter(edge => edge.source === currentNode)
        .map(edge => edge.target)
        .concat(
          graphData.edges
            .filter(edge => edge.target === currentNode)
            .map(edge => edge.source)
        );
      
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      });
      
      stepIndex++;
    }
  }
  
  // Final state
  steps.push({
    array: [{ value: 'BFS Complete', status: 'found' }],
    lineIndex: stepIndex,
    graphData: {
      nodes: graphData.nodes.map(node => ({
        ...node,
        status: visited.has(node.id) ? 'found' : 'default'
      })),
      edges: graphData.edges.map(edge => ({
        ...edge,
        status: 'visited'
      }))
    },
    description: 'BFS traversal completed'
  });
  
  return steps;
}

// Enhanced DFS Visualization
export function visualizeDFS(startNode: string = 'A'): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  const graphData = {
    nodes: [
      { id: 'A', x: 150, y: 50, status: 'default' },
      { id: 'B', x: 100, y: 150, status: 'default' },
      { id: 'C', x: 200, y: 150, status: 'default' },
      { id: 'D', x: 50, y: 250, status: 'default' },
      { id: 'E', x: 150, y: 250, status: 'default' },
      { id: 'F', x: 250, y: 250, status: 'default' }
    ],
    edges: [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'B', target: 'E', status: 'default' },
      { source: 'C', target: 'E', status: 'default' },
      { source: 'C', target: 'F', status: 'default' }
    ]
  };

  steps.push({
    array: [{ value: 'DFS Starting', status: 'default' }],
    lineIndex: 0,
    graphData: { ...graphData },
    description: `Starting DFS from node ${startNode}`
  });
  
  const visited = new Set<string>();
  const stack = [startNode];
  let stepIndex = 1;
  
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      const updatedGraphData = {
        nodes: graphData.nodes.map(node => ({
          ...node,
          status: visited.has(node.id) ? 'visited' : 
                  node.id === currentNode ? 'processing' : 'default'
        })),
        edges: graphData.edges.map(edge => ({
          ...edge,
          status: (visited.has(edge.source) && visited.has(edge.target)) ? 'path' : 'default'
        }))
      };
      
      steps.push({
        array: [{ value: `Visiting ${currentNode}`, status: 'found' }],
        lineIndex: stepIndex,
        graphData: updatedGraphData,
        description: `Visiting node ${currentNode}`
      });
      
      // Add neighbors to stack (in reverse order for proper DFS)
      const neighbors = graphData.edges
        .filter(edge => edge.source === currentNode || edge.target === currentNode)
        .map(edge => edge.source === currentNode ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor))
        .reverse();
      
      neighbors.forEach(neighbor => {
        if (!stack.includes(neighbor)) {
          stack.push(neighbor);
        }
      });
      
      stepIndex++;
    }
  }
  
  return steps;
}

// Enhanced Dijkstra's Algorithm Visualization
export function visualizeDijkstra(startNode: string = 'A'): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  const graphData = {
    nodes: [
      { id: 'A', x: 100, y: 100, distance: 0, status: 'source' },
      { id: 'B', x: 200, y: 50, distance: Infinity, status: 'default' },
      { id: 'C', x: 300, y: 100, distance: Infinity, status: 'default' },
      { id: 'D', x: 200, y: 150, distance: Infinity, status: 'default' },
      { id: 'E', x: 150, y: 200, distance: Infinity, status: 'default' }
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4, status: 'default' },
      { source: 'A', target: 'D', weight: 2, status: 'default' },
      { source: 'B', target: 'C', weight: 3, status: 'default' },
      { source: 'B', target: 'D', weight: 1, status: 'default' },
      { source: 'C', target: 'E', weight: 2, status: 'default' },
      { source: 'D', target: 'E', weight: 3, status: 'default' }
    ]
  };

  steps.push({
    array: [{ value: 'Dijkstra Start', status: 'default' }],
    lineIndex: 0,
    graphData: { ...graphData },
    description: `Finding shortest paths from ${startNode}`
  });
  
  const distances = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity };
  const visited = new Set<string>();
  const previous = {};
  
  // Set starting node distance to 0
  if (startNode !== 'A') {
    distances[startNode] = 0;
    distances['A'] = Infinity;
  }
  
  let stepIndex = 1;
  
  while (visited.size < graphData.nodes.length) {
    // Find unvisited node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    
    for (const node of graphData.nodes) {
      if (!visited.has(node.id) && distances[node.id] < minDistance) {
        minDistance = distances[node.id];
        currentNode = node.id;
      }
    }
    
    if (currentNode === null) break;
    
    visited.add(currentNode);
    
    // Update distances to neighbors
    const neighbors = graphData.edges.filter(
      edge => edge.source === currentNode || edge.target === currentNode
    );
    
    neighbors.forEach(edge => {
      const neighbor = edge.source === currentNode ? edge.target : edge.source;
      const newDistance = distances[currentNode] + edge.weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
      }
    });
    
    const updatedGraphData = {
      nodes: graphData.nodes.map(node => ({
        ...node,
        distance: distances[node.id],
        status: visited.has(node.id) ? 'visited' : 
                node.id === currentNode ? 'processing' : 'default'
      })),
      edges: graphData.edges.map(edge => ({
        ...edge,
        status: visited.has(edge.source) && visited.has(edge.target) ? 'path' : 'default'
      }))
    };
    
    steps.push({
      array: [{ value: `Process ${currentNode}`, status: 'found' }],
      lineIndex: stepIndex,
      graphData: updatedGraphData,
      description: `Processing node ${currentNode}, distance: ${distances[currentNode]}`
    });
    
    stepIndex++;
  }
  
  return steps;
}
