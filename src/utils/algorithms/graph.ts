
import { Network } from 'lucide-react';
import { Algorithm } from './types';

export const graphAlgorithms: Algorithm[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description: 'A graph traversal algorithm that explores all the vertices of a graph at the present depth before moving on to vertices at the next depth level.',
    icon: Network,
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'procedure BFS(G, start_v)',
      '    let Q be a queue',
      '    label start_v as discovered',
      '    Q.enqueue(start_v)',
      '    while Q is not empty do',
      '        v := Q.dequeue()',
      '        if v is the goal then',
      '            return v',
      '        for all edges from v to w in G.adjacentEdges(v) do',
      '            if w is not labeled as discovered then',
      '                label w as discovered',
      '                Q.enqueue(w)'
    ],
    implementation: `function bfs(graph, startNode, targetNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === targetNode) {
      return true; // Found the target
    }
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return false; // Target not found
}`
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    icon: Network,
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'procedure DFS(G, v)',
      '    label v as discovered',
      '    for all edges from v to w in G.adjacentEdges(v) do',
      '        if w is not labeled as discovered then',
      '            recursively call DFS(G, w)'
    ],
    implementation: `function dfs(graph, current, visited = new Set()) {
  visited.add(current);
  
  for (const neighbor of graph[current]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}`
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    category: 'graph',
    description: 'An algorithm for finding the shortest paths between nodes in a weighted graph.',
    icon: Network,
    timeComplexity: {
      best: 'O(V²)',
      average: 'O(E + V log V)',
      worst: 'O(E + V log V)'
    },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Dijkstra(Graph, source):',
      '    dist[source] := 0',
      '    create vertex priority queue Q',
      '    for each vertex v in Graph:',
      '        if v ≠ source',
      '            dist[v] := infinity',
      '        add v to Q',
      '    while Q is not empty:',
      '        u := vertex in Q with min dist[u]',
      '        remove u from Q',
      '        for each neighbor v of u:',
      '            alt := dist[u] + length(u, v)',
      '            if alt < dist[v]:',
      '                dist[v] := alt',
      '                update v in Q',
      '    return dist[]'
    ]
  }
];
