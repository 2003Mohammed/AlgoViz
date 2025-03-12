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
}`,
    realWorldExamples: [
      {
        title: "Social Network Analysis",
        description: "BFS is used to find all friends within a certain number of connections (e.g., 'friends of friends') on social platforms like Facebook and LinkedIn.",
        industry: "Social Media"
      },
      {
        title: "Web Crawling",
        description: "Search engines use BFS to crawl the web by visiting links from a page before moving to links at the next depth level.",
        industry: "Internet Technology"
      },
      {
        title: "GPS Navigation",
        description: "Modified BFS algorithms are used in GPS systems to find the shortest route between two locations in a road network.",
        industry: "Transportation"
      },
      {
        title: "Network Broadcasting",
        description: "In computer networks, BFS principles are used for broadcasting packets to all nodes efficiently.",
        industry: "Telecommunications"
      }
    ]
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
}`,
    realWorldExamples: [
      {
        title: "Maze Generation and Solving",
        description: "DFS is used to generate random mazes and find paths through existing mazes in puzzle games and artificial intelligence.",
        industry: "Gaming"
      },
      {
        title: "Topological Sorting",
        description: "In project management, DFS-based topological sorting helps schedule tasks with dependencies (e.g., in build systems like Make).",
        industry: "Software Development"
      },
      {
        title: "Cycle Detection",
        description: "DFS can detect cycles in directed graphs, useful in deadlock detection in operating systems and dependency resolution.",
        industry: "Systems Programming"
      },
      {
        title: "File System Traversal",
        description: "Operating systems use DFS to search for files in directory structures and calculate folder sizes recursively.",
        industry: "Operating Systems"
      }
    ]
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
    ],
    realWorldExamples: [
      {
        title: "Network Routing",
        description: "The OSPF protocol used in internet routing relies on Dijkstra's algorithm to determine the shortest path for data packets.",
        industry: "Networking"
      },
      {
        title: "Google Maps",
        description: "Navigation services like Google Maps use Dijkstra's algorithm (and variants) to find the shortest or fastest route between locations.",
        industry: "Maps & Navigation"
      },
      {
        title: "Flight Planning",
        description: "Airlines use shortest path algorithms to plan routes that minimize fuel consumption, time, or cost.",
        industry: "Aviation"
      },
      {
        title: "Supply Chain Optimization",
        description: "Companies use Dijkstra's algorithm to optimize logistics, finding the most efficient routes for product delivery.",
        industry: "Logistics"
      }
    ]
  }
];
