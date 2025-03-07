
import { 
  ArrowUpDown, 
  Search, 
  Network, 
  FolderTree, 
  Layers, 
  BarChart4 
} from 'lucide-react';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  pseudocode?: string[];
  implementation?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const categories: Category[] = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    description: 'Algorithms that arrange elements in a specific order',
    icon: ArrowUpDown
  },
  {
    id: 'searching',
    name: 'Searching Algorithms',
    description: 'Algorithms that find an element in a data structure',
    icon: Search
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    description: 'Algorithms that operate on graphs and networks',
    icon: Network
  },
  {
    id: 'tree',
    name: 'Tree Algorithms',
    description: 'Algorithms that operate on tree data structures',
    icon: FolderTree
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    description: 'Algorithms that break problems into simpler subproblems',
    icon: Layers
  },
  {
    id: 'other',
    name: 'Other Algorithms',
    description: 'Miscellaneous algorithms and data structures',
    icon: BarChart4
  }
];

export const algorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    icon: ArrowUpDown,
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure bubbleSort(A: list of sortable items)',
      '    n := length(A)',
      '    repeat',
      '        swapped := false',
      '        for i := 1 to n-1 inclusive do',
      '            if A[i-1] > A[i] then',
      '                swap(A[i-1], A[i])',
      '                swapped := true',
      '            end if',
      '        end for',
      '        n := n - 1',
      '    until not swapped',
      'end procedure'
    ],
    implementation: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}`
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'An efficient, divide-and-conquer sorting algorithm that selects a "pivot" element and partitions the array around the pivot.',
    icon: ArrowUpDown,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'function quicksort(A, lo, hi)',
      '    if lo < hi then',
      '        p := partition(A, lo, hi)',
      '        quicksort(A, lo, p - 1)',
      '        quicksort(A, p + 1, hi)',
      '',
      'function partition(A, lo, hi)',
      '    pivot := A[hi]',
      '    i := lo',
      '    for j := lo to hi do',
      '        if A[j] < pivot then',
      '            swap A[i] with A[j]',
      '            i := i + 1',
      '    swap A[i] with A[hi]',
      '    return i'
    ],
    implementation: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search space in half.',
    icon: Search,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function binarySearch(A, target)',
      '    left := 0',
      '    right := length(A) - 1',
      '    while left <= right do',
      '        mid := (left + right) / 2',
      '        if A[mid] == target then',
      '            return mid',
      '        else if A[mid] < target then',
      '            left := mid + 1',
      '        else',
      '            right := mid - 1',
      '    return -1'
    ],
    implementation: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`
  },
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
