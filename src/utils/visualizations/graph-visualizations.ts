import { VisualizationStep, GraphData } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

const buildStep = (
  graph: GraphData,
  lineIndex: number,
  description: string,
  activeNode?: string,
  visited = new Set<string>(),
  frontier = new Set<string>(),
  path = new Set<string>(),
  distances?: Record<string, number>
): VisualizationStep => ({
  array: [{ value: description, status: ITEM_STATUSES.DEFAULT }],
  lineIndex,
  description,
  graphData: {
    nodes: graph.nodes.map((node) => ({
      ...node,
      status: path.has(node.id)
        ? 'path'
        : node.id === activeNode
        ? 'processing'
        : visited.has(node.id)
        ? 'visited'
        : frontier.has(node.id)
        ? 'active'
        : 'default',
      distance: distances?.[node.id],
    })),
    edges: graph.edges.map((edge) => ({
      ...edge,
      status: path.has(edge.source) && path.has(edge.target) ? 'path' : visited.has(edge.source) && visited.has(edge.target) ? 'visited' : 'default',
    })),
  },
});

const neighborsOf = (graph: GraphData, nodeId: string) =>
  graph.edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => (edge.source === nodeId ? { id: edge.target, weight: edge.weight ?? 1 } : { id: edge.source, weight: edge.weight ?? 1 }));

export function visualizeGraphOperation(graph: GraphData, operation: string, startNode?: string): VisualizationStep[] {
  if (operation === 'bfs' && startNode) return visualizeBFS(graph, startNode);
  if (operation === 'dfs' && startNode) return visualizeDFS(graph, startNode);
  if (operation === 'astar' && startNode) return visualizeAStar(graph, startNode);
  if (operation === 'dijkstra' && startNode) return visualizeDijkstra(graph, startNode);
  return [];
}

export function visualizeBFS(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const frontier = new Set<string>([startNode]);
  const queue = [startNode];
  steps.push(buildStep(graph, 0, `Starting BFS from ${startNode}`, startNode, visited, frontier));

  while (queue.length) {
    const current = queue.shift()!;
    frontier.delete(current);
    if (visited.has(current)) continue;
    visited.add(current);
    steps.push(buildStep(graph, 1, `Visiting node ${current}`, current, visited, frontier));

    for (const neighbor of neighborsOf(graph, current)) {
      if (!visited.has(neighbor.id) && !frontier.has(neighbor.id)) {
        frontier.add(neighbor.id);
        queue.push(neighbor.id);
      }
    }
  }
  return steps;
}

export function visualizeDFS(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const stack = [startNode];
  const frontier = new Set<string>([startNode]);
  steps.push(buildStep(graph, 0, `Starting DFS from ${startNode}`, startNode, visited, frontier));

  while (stack.length) {
    const current = stack.pop()!;
    frontier.delete(current);
    if (visited.has(current)) continue;
    visited.add(current);
    steps.push(buildStep(graph, 1, `Visiting node ${current}`, current, visited, frontier));

    const neighbors = neighborsOf(graph, current).map((n) => n.id).reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !frontier.has(neighbor)) {
        frontier.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  return steps;
}

export function visualizeDijkstra(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const distances: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const frontier = new Set<string>();

  graph.nodes.forEach((node) => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    prev[node.id] = null;
    frontier.add(node.id);
  });

  steps.push(buildStep(graph, 0, `Starting Dijkstra from ${startNode}`, startNode, visited, frontier, new Set(), distances));

  while (frontier.size) {
    const current = [...frontier].reduce((best, id) => (distances[id] < distances[best] ? id : best));
    frontier.delete(current);
    visited.add(current);
    steps.push(buildStep(graph, 1, `Processing node ${current}`, current, visited, frontier, new Set(), distances));

    for (const neighbor of neighborsOf(graph, current)) {
      if (!frontier.has(neighbor.id)) continue;
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        prev[neighbor.id] = current;
        steps.push(buildStep(graph, 2, `Relax edge ${current} -> ${neighbor.id}`, neighbor.id, visited, frontier, new Set(), distances));
      }
    }
  }

  return steps;
}

export function visualizeAStar(graph: GraphData, startNode: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const goal = graph.nodes[graph.nodes.length - 1]?.id ?? startNode;
  const open = new Set<string>([startNode]);
  const closed = new Set<string>();
  const g: Record<string, number> = {};
  const f: Record<string, number> = {};

  const heuristic = (id: string) => {
    const from = graph.nodes.find((n) => n.id === id);
    const to = graph.nodes.find((n) => n.id === goal);
    if (!from || !to) return 0;
    return Math.hypot(from.x - to.x, from.y - to.y);
  };

  graph.nodes.forEach((node) => {
    g[node.id] = node.id === startNode ? 0 : Infinity;
    f[node.id] = node.id === startNode ? heuristic(node.id) : Infinity;
  });

  steps.push(buildStep(graph, 0, `Starting A* from ${startNode} to ${goal}`, startNode, closed, open, new Set(), g));

  while (open.size) {
    const current = [...open].reduce((best, id) => (f[id] < f[best] ? id : best));
    if (current === goal) {
      closed.add(current);
      steps.push(buildStep(graph, 3, `Reached goal ${goal}`, current, closed, open, new Set([goal]), g));
      break;
    }

    open.delete(current);
    closed.add(current);
    steps.push(buildStep(graph, 1, `Expanding ${current}`, current, closed, open, new Set(), g));

    for (const neighbor of neighborsOf(graph, current)) {
      if (closed.has(neighbor.id)) continue;
      const tentative = g[current] + neighbor.weight;
      if (tentative < g[neighbor.id]) {
        g[neighbor.id] = tentative;
        f[neighbor.id] = tentative + heuristic(neighbor.id);
        open.add(neighbor.id);
        steps.push(buildStep(graph, 2, `Update ${neighbor.id}: g=${tentative.toFixed(1)}`, neighbor.id, closed, open, new Set(), g));
      }
    }
  }

  return steps;
}
