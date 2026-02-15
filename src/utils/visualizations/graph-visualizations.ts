
import { ArrayItem, VisualizationStep, GraphData } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

export function visualizeGraphOperation(
  graph: GraphData,
  operation: string,
  startNode?: string,
  endNode?: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  if (operation === 'bfs' && startNode) {
    return visualizeBFS(graph, startNode);
  } else if (operation === 'dfs' && startNode) {
    return visualizeDFS(graph, startNode);
  // else if (operation === 'dijkstra' && startNode) {
    // return visualizeDijkstra(graph, startNode, endNode);
  }
  
  return steps;
}

export function visualizeBFS(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const queue = [startNode];
  
  steps.push({
    array: [{ value: 'BFS Starting', status: ITEM_STATUSES.DEFAULT }],
    lineIndex: 0,
    graphData: {
      nodes: graph.nodes.map(node => ({ ...node, status: 'default' as const })),
      edges: graph.edges.map(edge => ({ ...edge, status: 'default' as const }))
    },
    description: `Starting BFS from node ${startNode}`
  });
  
  let stepIndex = 1;
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      const updatedGraphData = {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: visited.has(node.id) ? ('visited' as const) : 
                  node.id === currentNode ? ('processing' as const) : ('default' as const)
        })),
        edges: graph.edges.map(edge => ({
          ...edge,
          status: (visited.has(edge.source) && visited.has(edge.target)) ? ('visited' as const) : ('default' as const)
        }))
      };
      
      steps.push({
        array: [{ value: `Visiting ${currentNode}`, status: ITEM_STATUSES.FOUND }],
        lineIndex: stepIndex,
        graphData: updatedGraphData,
        description: `Visiting node ${currentNode}`
      });
      
      const neighbors = graph.edges
        .filter(edge => edge.source === currentNode || edge.target === currentNode)
        .map(edge => edge.source === currentNode ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));
      
      neighbors.forEach(neighbor => queue.push(neighbor));
      stepIndex++;
    }
  }
  
  return steps;
}

export function visualizeDFS(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const stack = [startNode];
  
  steps.push({
    array: [{ value: 'DFS Starting', status: ITEM_STATUSES.DEFAULT }],
    lineIndex: 0,
    graphData: {
      nodes: graph.nodes.map(node => ({ ...node, status: 'default' as const })),
      edges: graph.edges.map(edge => ({ ...edge, status: 'default' as const }))
    },
    description: `Starting DFS from node ${startNode}`
  });
  
  let stepIndex = 1;
  
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      
      const updatedGraphData = {
        nodes: graph.nodes.map(node => ({
          ...node,
          status: visited.has(node.id) ? ('visited' as const) : 
                  node.id === currentNode ? ('processing' as const) : ('default' as const)
        })),
        edges: graph.edges.map(edge => ({
          ...edge,
          status: (visited.has(edge.source) && visited.has(edge.target)) ? ('path' as const) : ('default' as const)
        }))
      };
      
      steps.push({
        array: [{ value: `Visiting ${currentNode}`, status: ITEM_STATUSES.FOUND }],
        lineIndex: stepIndex,
        graphData: updatedGraphData,
        description: `Visiting node ${currentNode}`
      });
      
      const neighbors = graph.edges
        .filter(edge => edge.source === currentNode || edge.target === currentNode)
        .map(edge => edge.source === currentNode ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor));
      
      neighbors.reverse().forEach(neighbor => {
        if (!stack.includes(neighbor)) {
          stack.push(neighbor);
        }
      });
      
      stepIndex++;
    }
  }
  
  return steps;
}

export function visualizeDijkstra(graph: GraphData, startNode: string, endNode?: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const distances: { [key: string]: number } = {};
  const visited = new Set<string>();
  
  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
  });
  
  steps.push({
    array: [{ value: 'Dijkstra Start', status: ITEM_STATUSES.DEFAULT }],
    lineIndex: 0,
    graphData: {
      nodes: graph.nodes.map(node => ({
        ...node,
        distance: distances[node.id],
        status: node.id === startNode ? ('target' as const) : ('default' as const)
      })),
      edges: graph.edges.map(edge => ({ ...edge, status: 'default' as const }))
    },
    description: `Finding shortest paths from ${startNode}`
  });
  
  let stepIndex = 1;
  
  while (visited.size < graph.nodes.length) {
    let currentNode: string | null = null;
    let minDistance = Infinity;
    
    for (const node of graph.nodes) {
      if (!visited.has(node.id) && distances[node.id] < minDistance) {
        minDistance = distances[node.id];
        currentNode = node.id;
      }
    }
    
    if (currentNode === null) break;
    
    visited.add(currentNode);
    
    // Update distances to neighbors
    const neighbors = graph.edges.filter(
      edge => edge.source === currentNode || edge.target === currentNode
    );
    
    neighbors.forEach(edge => {
      const neighbor = edge.source === currentNode ? edge.target : edge.source;
      const weight = edge.weight || 1;
      const newDistance = distances[currentNode!] + weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
      }
    });
    
    const updatedGraphData = {
      nodes: graph.nodes.map(node => ({
        ...node,
        distance: distances[node.id],
        status: visited.has(node.id) ? ('visited' as const) : 
                node.id === currentNode ? ('processing' as const) : ('default' as const)
      })),
      edges: graph.edges.map(edge => ({
        ...edge,
        status: visited.has(edge.source) && visited.has(edge.target) ? ('path' as const) : ('default' as const)
      }))
    };
    
    steps.push({
      array: [{ value: `Process ${currentNode}`, status: ITEM_STATUSES.FOUND }],
      lineIndex: stepIndex,
      graphData: updatedGraphData,
      description: `Processing node ${currentNode}, distance: ${distances[currentNode]}`
    });
    
    stepIndex++;
  }
  
  return steps;
}