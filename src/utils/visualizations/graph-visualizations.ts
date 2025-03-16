
import { GraphData, GraphNode, GraphEdge, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes graph operations like traversal and pathfinding
 */
export function visualizeGraphOperation(
  graphData: GraphData, 
  operation: string, 
  startNodeId?: string, 
  endNodeId?: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Create a copy of the initial graph to avoid modifying the original
  const initialNodes = graphData.nodes.map(node => ({ ...node, status: 'default' as GraphNode['status'] }));
  const initialEdges = graphData.edges.map(edge => ({ ...edge, status: 'default' as GraphEdge['status'] }));
  
  // First step: initial state
  steps.push({
    array: [], // Empty array for graph visualization
    lineIndex: 0,
    graphData: {
      nodes: initialNodes,
      edges: initialEdges
    }
  });
  
  if (operation === 'bfs' || operation === 'dfs') {
    return visualizeGraphTraversal(graphData, operation, startNodeId, steps);
  } else if (operation === 'dijkstra') {
    return visualizeDijkstra(graphData, startNodeId, endNodeId, steps);
  }
  
  return steps;
}

/**
 * Visualizes graph traversal algorithms (BFS/DFS)
 */
function visualizeGraphTraversal(
  graphData: GraphData,
  traversalType: 'bfs' | 'dfs',
  startNodeId?: string,
  initialSteps: VisualizationStep[] = []
): VisualizationStep[] {
  const steps = [...initialSteps];
  const { nodes, edges } = graphData;
  
  if (!startNodeId || !nodes.find(n => n.id === startNodeId)) {
    // If no valid start node, return initial state only
    return steps;
  }
  
  // Create an adjacency list from the graph
  const adjacencyList = createAdjacencyList(graphData);
  
  // Track visited nodes
  const visited = new Set<string>();
  
  if (traversalType === 'bfs') {
    // BFS uses a queue
    const queue: string[] = [startNodeId];
    visited.add(startNodeId);
    
    // Add step for starting node
    const startStep = createTraversalStep(graphData, visited, queue, [], 1);
    steps.push(startStep);
    
    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      const neighbors = adjacencyList[currentNodeId] || [];
      
      // Process each neighbor
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          
          // Create a step showing the neighbor being added to the queue
          const neighborStep = createTraversalStep(
            graphData, 
            visited, 
            queue, 
            [{ source: currentNodeId, target: neighbor }],
            2
          );
          steps.push(neighborStep);
        }
      }
    }
  } else if (traversalType === 'dfs') {
    // Implement DFS visualization using recursion or stack
    dfsRecursive(startNodeId, adjacencyList, visited, graphData, steps);
  }
  
  return steps;
}

/**
 * Helper function for DFS traversal visualization
 */
function dfsRecursive(
  currentNodeId: string,
  adjacencyList: Record<string, string[]>,
  visited: Set<string>,
  graphData: GraphData,
  steps: VisualizationStep[]
): void {
  visited.add(currentNodeId);
  
  // Add step for visiting this node
  steps.push(createTraversalStep(graphData, visited, [], [], 1));
  
  const neighbors = adjacencyList[currentNodeId] || [];
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      // Add step for the edge being traversed
      steps.push(createTraversalStep(
        graphData, 
        visited, 
        [], 
        [{ source: currentNodeId, target: neighbor }],
        2
      ));
      
      dfsRecursive(neighbor, adjacencyList, visited, graphData, steps);
    }
  }
}

/**
 * Visualizes Dijkstra's algorithm
 */
function visualizeDijkstra(
  graphData: GraphData,
  startNodeId?: string,
  endNodeId?: string,
  initialSteps: VisualizationStep[] = []
): VisualizationStep[] {
  const steps = [...initialSteps];
  const { nodes, edges } = graphData;
  
  if (!startNodeId || !nodes.find(n => n.id === startNodeId)) {
    // If no valid start node, return initial state only
    return steps;
  }
  
  // Create an adjacency list with weights
  const adjacencyList = createWeightedAdjacencyList(graphData);
  
  // Initialize distances and previous nodes
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  
  // Initialize all distances to Infinity except the start node
  for (const node of nodes) {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }
  
  // Add initial step
  steps.push(createDijkstraStep(graphData, unvisited, distances, previous, 1));
  
  while (unvisited.size > 0) {
    // Find the node with the minimum distance
    let currentNodeId: string | null = null;
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    }
    
    // If we found the end node or all remaining nodes are unreachable
    if (currentNodeId === null || distances[currentNodeId] === Infinity || currentNodeId === endNodeId) {
      break;
    }
    
    // Remove current node from unvisited
    unvisited.delete(currentNodeId);
    
    // Add step showing current node being processed
    steps.push(createDijkstraStep(
      graphData, 
      unvisited, 
      distances, 
      previous, 
      2,
      currentNodeId
    ));
    
    // Process all neighbors
    for (const [neighborId, weight] of adjacencyList[currentNodeId] || []) {
      if (unvisited.has(neighborId)) {
        const tentativeDistance = distances[currentNodeId] + weight;
        
        if (tentativeDistance < distances[neighborId]) {
          // Add step showing edge consideration
          steps.push(createDijkstraStep(
            graphData,
            unvisited,
            distances,
            previous,
            3,
            currentNodeId,
            neighborId
          ));
          
          // Update distance and previous node
          distances[neighborId] = tentativeDistance;
          previous[neighborId] = currentNodeId;
          
          // Add step showing distance update
          steps.push(createDijkstraStep(
            graphData,
            unvisited,
            distances,
            previous,
            4,
            currentNodeId,
            neighborId
          ));
        }
      }
    }
  }
  
  // If we have an end node, visualize the path
  if (endNodeId && previous[endNodeId] !== null) {
    const path: string[] = [];
    let current = endNodeId;
    
    while (current) {
      path.unshift(current);
      current = previous[current] || '';
      if (!current) break;
    }
    
    // Add final step showing the shortest path
    steps.push(createDijkstraPathStep(graphData, path, 5));
  }
  
  return steps;
}

/**
 * Helper function to create a step for the visualization
 */
function createTraversalStep(
  graphData: GraphData,
  visited: Set<string>,
  queue: string[],
  currentEdges: { source: string, target: string }[],
  lineIndex: number
): VisualizationStep {
  const { nodes, edges } = graphData;
  
  // Create copies with updated statuses
  const updatedNodes = nodes.map(node => ({
    ...node,
    status: visited.has(node.id) 
      ? queue.includes(node.id) 
        ? 'processing' as GraphNode['status']
        : 'visited' as GraphNode['status']
      : 'default' as GraphNode['status']
  }));
  
  const updatedEdges = edges.map(edge => {
    const isCurrentEdge = currentEdges.some(
      e => e.source === edge.source && e.target === edge.target
    );
    
    return {
      ...edge,
      status: isCurrentEdge 
        ? 'visited' as GraphEdge['status']
        : (visited.has(edge.source) && visited.has(edge.target)) 
          ? 'visited' as GraphEdge['status']
          : 'default' as GraphEdge['status']
    };
  });
  
  return {
    array: [], // Empty array for graph visualization
    lineIndex,
    graphData: {
      nodes: updatedNodes,
      edges: updatedEdges
    }
  };
}

/**
 * Helper function to create a step for Dijkstra's algorithm visualization
 */
function createDijkstraStep(
  graphData: GraphData,
  unvisited: Set<string>,
  distances: Record<string, number>,
  previous: Record<string, string | null>,
  lineIndex: number,
  currentNodeId?: string,
  neighborId?: string
): VisualizationStep {
  const { nodes, edges } = graphData;
  
  // Create copies with updated statuses
  const updatedNodes = nodes.map(node => {
    if (node.id === currentNodeId) return { ...node, status: 'processing' as GraphNode['status'] };
    if (node.id === neighborId) return { ...node, status: 'comparing' as GraphNode['status'] };
    if (!unvisited.has(node.id)) return { ...node, status: 'visited' as GraphNode['status'] };
    return { ...node, status: 'default' as GraphNode['status'] };
  });
  
  const updatedEdges = edges.map(edge => {
    if (edge.source === currentNodeId && edge.target === neighborId) {
      return { ...edge, status: 'comparing' as GraphEdge['status'] };
    }
    
    // Highlight edges in the current shortest paths
    if (previous[edge.target] === edge.source || previous[edge.source] === edge.target) {
      return { ...edge, status: 'visited' as GraphEdge['status'] };
    }
    
    return { ...edge, status: 'default' as GraphEdge['status'] };
  });
  
  return {
    array: [], // Empty array for graph visualization
    lineIndex,
    graphData: {
      nodes: updatedNodes,
      edges: updatedEdges
    }
  };
}

/**
 * Helper function to create a final path step for Dijkstra's algorithm
 */
function createDijkstraPathStep(
  graphData: GraphData,
  path: string[],
  lineIndex: number
): VisualizationStep {
  const { nodes, edges } = graphData;
  
  // Create copies with updated statuses
  const updatedNodes = nodes.map(node => ({
    ...node,
    status: path.includes(node.id) ? 'path' as GraphNode['status'] : 'visited' as GraphNode['status']
  }));
  
  const updatedEdges = edges.map(edge => {
    // Check if this edge is part of the path
    const sourceIndex = path.indexOf(edge.source);
    const targetIndex = path.indexOf(edge.target);
    
    const isPathEdge = sourceIndex !== -1 && targetIndex !== -1 && 
                        Math.abs(sourceIndex - targetIndex) === 1;
    
    return {
      ...edge,
      status: isPathEdge ? 'path' as GraphEdge['status'] : 'visited' as GraphEdge['status']
    };
  });
  
  return {
    array: [], // Empty array for graph visualization
    lineIndex,
    graphData: {
      nodes: updatedNodes,
      edges: updatedEdges
    }
  };
}

/**
 * Helper function to create an adjacency list from graph data
 */
function createAdjacencyList(graphData: GraphData): Record<string, string[]> {
  const adjacencyList: Record<string, string[]> = {};
  
  for (const edge of graphData.edges) {
    if (!adjacencyList[edge.source]) {
      adjacencyList[edge.source] = [];
    }
    adjacencyList[edge.source].push(edge.target);
    
    // For undirected graphs, add the reverse edge as well
    if (edge.directed === false) {
      if (!adjacencyList[edge.target]) {
        adjacencyList[edge.target] = [];
      }
      adjacencyList[edge.target].push(edge.source);
    }
  }
  
  return adjacencyList;
}

/**
 * Helper function to create a weighted adjacency list from graph data
 */
function createWeightedAdjacencyList(graphData: GraphData): Record<string, Array<[string, number]>> {
  const adjacencyList: Record<string, Array<[string, number]>> = {};
  
  for (const edge of graphData.edges) {
    const weight = edge.weight || 1;
    
    if (!adjacencyList[edge.source]) {
      adjacencyList[edge.source] = [];
    }
    adjacencyList[edge.source].push([edge.target, weight]);
    
    // For undirected graphs, add the reverse edge as well
    if (edge.directed === false) {
      if (!adjacencyList[edge.target]) {
        adjacencyList[edge.target] = [];
      }
      adjacencyList[edge.target].push([edge.source, weight]);
    }
  }
  
  return adjacencyList;
}
