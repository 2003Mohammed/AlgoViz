
import { ArrayItem, VisualizationStep, GraphData, GraphNode, GraphEdge } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

export function visualizeGraphOperation(
  graphData: GraphData,
  operation: string,
  startNodeId?: string,
  endNodeId?: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Initial state
  steps.push({
    array: [],
    lineIndex: 0,
    graphData: JSON.parse(JSON.stringify(graphData)),
    description: `Graph ${operation} visualization`
  });
  
  if (operation === 'bfs' && startNodeId) {
    return visualizeBFS(graphData, startNodeId, endNodeId);
  } else if (operation === 'dfs' && startNodeId) {
    return visualizeDFS(graphData, startNodeId, endNodeId);
  } else if (operation === 'dijkstra' && startNodeId && endNodeId) {
    return visualizeDijkstra(graphData, startNodeId, endNodeId);
  }
  
  return steps;
}

function visualizeBFS(graphData: GraphData, startNodeId: string, endNodeId?: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const queue = [startNodeId];
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    if (visited.has(currentNodeId)) continue;
    visited.add(currentNodeId);
    
    // Update graph visualization
    const currentGraphData = JSON.parse(JSON.stringify(graphData));
    currentGraphData.nodes.forEach((node: GraphNode) => {
      if (node.id === currentNodeId) {
        node.status = 'processing';
      } else if (visited.has(node.id)) {
        node.status = 'visited';
      } else if (queue.includes(node.id)) {
        node.status = 'active';
      }
    });
    
    steps.push({
      array: [],
      lineIndex: visited.size,
      graphData: currentGraphData,
      description: `Visiting node: ${currentNodeId}`
    });
    
    if (currentNodeId === endNodeId) {
      steps.push({
        array: [],
        lineIndex: visited.size,
        graphData: currentGraphData,
        description: `Found target node: ${endNodeId}`
      });
      break;
    }
    
    // Add neighbors to queue
    graphData.edges
      .filter(edge => edge.source === currentNodeId)
      .forEach(edge => {
        if (!visited.has(edge.target) && !queue.includes(edge.target)) {
          queue.push(edge.target);
        }
      });
  }
  
  return steps;
}

function visualizeDFS(graphData: GraphData, startNodeId: string, endNodeId?: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  
  function dfsRecursive(nodeId: string): boolean {
    visited.add(nodeId);
    
    const currentGraphData = JSON.parse(JSON.stringify(graphData));
    currentGraphData.nodes.forEach((node: GraphNode) => {
      if (node.id === nodeId) {
        node.status = 'processing';
      } else if (visited.has(node.id)) {
        node.status = 'visited';
      }
    });
    
    steps.push({
      array: [],
      lineIndex: visited.size,
      graphData: currentGraphData,
      description: `Visiting node: ${nodeId}`
    });
    
    if (nodeId === endNodeId) {
      steps.push({
        array: [],
        lineIndex: visited.size,
        graphData: currentGraphData,
        description: `Found target node: ${endNodeId}`
      });
      return true;
    }
    
    for (const edge of graphData.edges.filter(e => e.source === nodeId)) {
      if (!visited.has(edge.target)) {
        if (dfsRecursive(edge.target)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  dfsRecursive(startNodeId);
  return steps;
}

function visualizeDijkstra(graphData: GraphData, startNodeId: string, endNodeId: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const distances = new Map<string, number>();
  const visited = new Set<string>();
  const previous = new Map<string, string>();
  
  // Initialize distances
  graphData.nodes.forEach(node => {
    distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
  });
  
  while (visited.size < graphData.nodes.length) {
    // Find unvisited node with minimum distance
    let currentNode: string | null = null;
    let minDistance = Infinity;
    
    for (const node of graphData.nodes) {
      if (!visited.has(node.id) && distances.get(node.id)! < minDistance) {
        minDistance = distances.get(node.id)!;
        currentNode = node.id;
      }
    }
    
    if (!currentNode || minDistance === Infinity) break;
    
    visited.add(currentNode);
    
    // Update visualization
    const currentGraphData = JSON.parse(JSON.stringify(graphData));
    currentGraphData.nodes.forEach((node: GraphNode) => {
      if (node.id === currentNode) {
        node.status = 'processing';
      } else if (visited.has(node.id)) {
        node.status = 'visited';
      }
    });
    
    steps.push({
      array: [],
      lineIndex: visited.size,
      graphData: currentGraphData,
      description: `Processing node: ${currentNode} (distance: ${minDistance})`
    });
    
    if (currentNode === endNodeId) {
      steps.push({
        array: [],
        lineIndex: visited.size,
        graphData: currentGraphData,
        description: `Reached target node: ${endNodeId} with distance: ${minDistance}`
      });
      break;
    }
    
    // Update distances to neighbors
    graphData.edges
      .filter(edge => edge.source === currentNode)
      .forEach(edge => {
        const newDistance = distances.get(currentNode!)! + (edge.weight || 1);
        if (newDistance < distances.get(edge.target)!) {
          distances.set(edge.target, newDistance);
          previous.set(edge.target, currentNode!);
        }
      });
  }
  
  return steps;
}
