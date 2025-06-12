import { VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes graph operations like BFS, DFS, shortest path
 */
export function visualizeGraphOperation(graph: any, operation: string, startNode?: string, endNode?: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Create initial state
  const initialState = {
    array: [],
    lineIndex: 0,
    graphData: {
      nodes: [...graph.nodes],
      edges: [...graph.edges]
    }
  };
  
  steps.push(initialState);
  
  switch (operation) {
    case 'bfs':
      return visualizeBFS(graph, startNode, steps);
    case 'dfs':
      return visualizeDFS(graph, startNode, steps);
    case 'dijkstra':
      return visualizeDijkstra(graph, startNode, endNode, steps);
    case 'detect-cycle':
      return visualizeDetectCycle(graph, steps);
    default:
      return steps;
  }
}

/**
 * Visualizes Breadth-First Search algorithm
 */
function visualizeBFS(graph: any, startNode: string | undefined, steps: VisualizationStep[]): VisualizationStep[] {
  if (!startNode || !graph.nodes.find(node => node.id === startNode)) {
    return steps;
  }
  
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    // Mark current node as processing
    const processingState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: node.id === currentNode ? ITEM_STATUSES.PROCESSING : 
                  visited.has(node.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(processingState);
    
    // Find all adjacent nodes
    const adjacentEdges = graph.edges.filter(edge => edge.source === currentNode);
    
    for (const edge of adjacentEdges) {
      const neighbor = edge.target;
      
      if (!visited.has(neighbor)) {
        // Highlight edge and neighbor
        const exploreState = {
          array: [],
          lineIndex: steps.length,
          graphData: {
            nodes: graph.nodes.map(node => ({
              ...node,
              status: node.id === currentNode ? ITEM_STATUSES.PROCESSING : 
                      node.id === neighbor ? ITEM_STATUSES.COMPARING :
                      visited.has(node.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
            })),
            edges: graph.edges.map(e => ({
              ...e,
              status: (e.source === currentNode && e.target === neighbor) ? ITEM_STATUSES.COMPARING : ITEM_STATUSES.DEFAULT
            }))
          }
        };
        
        steps.push(exploreState);
        
        // Add to queue and mark as visited
        queue.push(neighbor);
        visited.add(neighbor);
      }
    }
    
    // Mark current node as fully visited
    const visitedState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: visited.has(node.id) ? 
                  (node.id === currentNode ? ITEM_STATUSES.VISITED : 
                   queue.includes(node.id) ? ITEM_STATUSES.COMPARING : ITEM_STATUSES.VISITED) : 
                  ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(visitedState);
  }
  
  return steps;
}

/**
 * Visualizes Depth-First Search algorithm
 */
function visualizeDFS(graph: any, startNode: string | undefined, steps: VisualizationStep[]): VisualizationStep[] {
  if (!startNode || !graph.nodes.find(node => node.id === startNode)) {
    return steps;
  }
  
  const visited = new Set<string>();
  
  function dfs(node: string) {
    // Mark current node as processing
    const processingState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(n => ({
          ...n,
          status: n.id === node ? ITEM_STATUSES.PROCESSING : 
                  visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(processingState);
    
    visited.add(node);
    
    // Find all adjacent nodes
    const adjacentEdges = graph.edges.filter(edge => edge.source === node);
    
    for (const edge of adjacentEdges) {
      const neighbor = edge.target;
      
      if (!visited.has(neighbor)) {
        // Highlight edge and neighbor
        const exploreState = {
          array: [],
          lineIndex: steps.length,
          graphData: {
            nodes: graph.nodes.map(n => ({
              ...n,
              status: n.id === node ? ITEM_STATUSES.PROCESSING : 
                      n.id === neighbor ? ITEM_STATUSES.COMPARING :
                      visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
            })),
            edges: graph.edges.map(e => ({
              ...e,
              status: (e.source === node && e.target === neighbor) ? ITEM_STATUSES.COMPARING : ITEM_STATUSES.DEFAULT
            }))
          }
        };
        
        steps.push(exploreState);
        
        // Recursive call
        dfs(neighbor);
      }
    }
    
    // Mark current node as fully visited
    const visitedState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(n => ({
          ...n,
          status: visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(visitedState);
  }
  
  dfs(startNode);
  
  return steps;
}

/**
 * Visualizes Dijkstra's shortest path algorithm
 */
function visualizeDijkstra(graph: any, startNode: string | undefined, endNode: string | undefined, steps: VisualizationStep[]): VisualizationStep[] {
  if (!startNode || !endNode || 
      !graph.nodes.find(node => node.id === startNode) || 
      !graph.nodes.find(node => node.id === endNode)) {
    return steps;
  }
  
  // Initialize distances
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  
  // Set initial distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });
  
  // Initial state
  const initialState = {
    array: [],
    lineIndex: 0,
    graphData: {
      nodes: graph.nodes.map(node => ({
        ...node,
        status: node.id === startNode ? ITEM_STATUSES.PROCESSING : ITEM_STATUSES.DEFAULT
      })),
      edges: [...graph.edges]
    }
  };
  
  steps.push(initialState);
  
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: string | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    });
    
    // If we can't find a node or reached the end, break
    if (current === null || current === endNode || minDistance === Infinity) {
      break;
    }
    
    // Remove from unvisited
    unvisited.delete(current);
    
    // Mark current node as processing
    const processingState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: node.id === current ? ITEM_STATUSES.PROCESSING : 
                  !unvisited.has(node.id) ? ITEM_STATUSES.VISITED :
                  node.id === endNode ? ITEM_STATUSES.TARGET : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(processingState);
    
    // Find all adjacent nodes
    const adjacentEdges = graph.edges.filter(edge => edge.source === current);
    
    for (const edge of adjacentEdges) {
      const neighbor = edge.target;
      
      if (unvisited.has(neighbor)) {
        // Calculate new distance
        const weight = edge.weight || 1;
        const newDistance = distances[current] + weight;
        
        // Highlight edge and neighbor
        const exploreState = {
          array: [],
          lineIndex: steps.length,
          graphData: {
            nodes: graph.nodes.map(node => ({
              ...node,
              status: node.id === current ? ITEM_STATUSES.PROCESSING : 
                      node.id === neighbor ? ITEM_STATUSES.COMPARING :
                      !unvisited.has(node.id) ? ITEM_STATUSES.VISITED :
                      node.id === endNode ? ITEM_STATUSES.TARGET : ITEM_STATUSES.DEFAULT
            })),
            edges: graph.edges.map(e => ({
              ...e,
              status: (e.source === current && e.target === neighbor) ? ITEM_STATUSES.COMPARING : ITEM_STATUSES.DEFAULT
            }))
          }
        };
        
        steps.push(exploreState);
        
        // Update distance if shorter
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    }
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current = endNode;
  
  while (current) {
    path.unshift(current);
    current = previous[current] || '';
    if (!current) break;
  }
  
  // Visualize final path
  if (path.length > 1 && path[0] === startNode) {
    const pathState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: path.includes(node.id) ? ITEM_STATUSES.PATH : 
                  !unvisited.has(node.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: graph.edges.map(edge => {
          const sourceIndex = path.indexOf(edge.source);
          const targetIndex = path.indexOf(edge.target);
          return {
            ...edge,
            status: (sourceIndex !== -1 && targetIndex !== -1 && Math.abs(sourceIndex - targetIndex) === 1) ? 
                    ITEM_STATUSES.PATH : ITEM_STATUSES.DEFAULT
          };
        })
      }
    };
    
    steps.push(pathState);
  }
  
  return steps;
}

/**
 * Visualizes cycle detection in a graph
 */
function visualizeDetectCycle(graph: any, steps: VisualizationStep[]): VisualizationStep[] {
  const visited = new Set<string>();
  const recStack = new Set<string>();
  let cycleFound = false;
  const cycleNodes: string[] = [];
  
  function detectCycle(node: string, parent: string | null = null) {
    if (cycleFound) return;
    
    // Mark node as visited and add to recursion stack
    visited.add(node);
    recStack.add(node);
    
    // Visualize current state
    const currentState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(n => ({
          ...n,
          status: recStack.has(n.id) ? ITEM_STATUSES.PROCESSING : 
                  visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(currentState);
    
    // Check all adjacent vertices
    const adjacentEdges = graph.edges.filter(edge => edge.source === node);
    
    for (const edge of adjacentEdges) {
      const neighbor = edge.target;
      
      // Skip parent in undirected graph
      if (parent === neighbor) continue;
      
      // Highlight edge being checked
      const checkEdgeState = {
        array: [],
        lineIndex: steps.length,
        graphData: {
          nodes: graph.nodes.map(n => ({
            ...n,
            status: n.id === node ? ITEM_STATUSES.PROCESSING : 
                    n.id === neighbor ? ITEM_STATUSES.COMPARING :
                    recStack.has(n.id) ? ITEM_STATUSES.PROCESSING :
                    visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
          })),
          edges: graph.edges.map(e => ({
            ...e,
            status: (e.source === node && e.target === neighbor) ? ITEM_STATUSES.COMPARING : ITEM_STATUSES.DEFAULT
          }))
        }
      };
      
      steps.push(checkEdgeState);
      
      // If neighbor is in recursion stack, we found a cycle
      if (recStack.has(neighbor)) {
        cycleFound = true;
        cycleNodes.push(node, neighbor);
        
        // Visualize cycle
        const cycleState = {
          array: [],
          lineIndex: steps.length,
          graphData: {
            nodes: graph.nodes.map(n => ({
              ...n,
              status: n.id === node || n.id === neighbor ? ITEM_STATUSES.FOUND :
                      recStack.has(n.id) ? ITEM_STATUSES.PROCESSING :
                      visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
            })),
            edges: graph.edges.map(e => ({
              ...e,
              status: (e.source === node && e.target === neighbor) ? ITEM_STATUSES.FOUND : ITEM_STATUSES.DEFAULT
            }))
          }
        };
        
        steps.push(cycleState);
        return;
      }
      
      // If neighbor is not visited, recursively check it
      if (!visited.has(neighbor)) {
        detectCycle(neighbor, node);
        
        // If cycle was found in recursive call, return
        if (cycleFound) return;
      }
    }
    
    // Remove node from recursion stack when done
    recStack.delete(node);
    
    // Visualize backtracking
    const backtrackState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(n => ({
          ...n,
          status: recStack.has(n.id) ? ITEM_STATUSES.PROCESSING : 
                  visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: [...graph.edges]
      }
    };
    
    steps.push(backtrackState);
  }
  
  // Start DFS from each unvisited node
  for (const node of graph.nodes) {
    if (!visited.has(node.id) && !cycleFound) {
      detectCycle(node.id);
    }
  }
  
  // Final state - highlight cycle if found
  if (cycleFound) {
    const finalState = {
      array: [],
      lineIndex: steps.length,
      graphData: {
        nodes: graph.nodes.map(n => ({
          ...n,
          status: cycleNodes.includes(n.id) ? ITEM_STATUSES.FOUND :
                  visited.has(n.id) ? ITEM_STATUSES.VISITED : ITEM_STATUSES.DEFAULT
        })),
        edges: graph.edges.map(e => ({
          ...e,
          status: (cycleNodes.includes(e.source) && cycleNodes.includes(e.target)) ? 
                  ITEM_STATUSES.FOUND : ITEM_STATUSES.DEFAULT
        }))
      }
    };
    
    steps.push(finalState);
  }
  
  return steps;
}
