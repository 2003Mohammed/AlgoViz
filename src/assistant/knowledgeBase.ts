import type { KnowledgeEntry } from './types';

const requiredKnowledgeFields: Array<keyof Pick<KnowledgeEntry,
  'definition' |
  'intuition' |
  'complexity' |
  'useCases' |
  'comparisons' |
  'pitfalls' |
  'implementationNotes' |
  'edgeCases' |
  'examples'
>> = [
  'definition',
  'intuition',
  'complexity',
  'useCases',
  'comparisons',
  'pitfalls',
  'implementationNotes',
  'edgeCases',
  'examples'
];

const isDevelopmentLikeEnv = () => {
  const importMetaEnv = (import.meta as ImportMeta & { env?: { DEV?: boolean; MODE?: string } }).env;
  if (importMetaEnv?.DEV) return true;
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV !== 'production';
  }
  return true;
};

export const validateKnowledgeBase = (base: Record<string, KnowledgeEntry>) => {
  if (!isDevelopmentLikeEnv()) return;

  Object.entries(base).forEach(([id, entry]) => {
    const missingFields = requiredKnowledgeFields.filter((field) => {
      const value = entry[field];
      if (value === null || value === undefined) return true;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'string') return value.trim().length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    });

    if (missingFields.length > 0) {
      console.warn(`[AlgoViz Assistant] Knowledge entry "${id}" is missing required fields: ${missingFields.join(', ')}`);
    }
  });
};

/**
 * Structured knowledge entries power deterministic assistant behavior.
 * To add support for a new algorithm/data structure:
 * 1) add one KnowledgeEntry below
 * 2) no changes are required in classifier/router/composer
 */
export const knowledgeBase: Record<string, KnowledgeEntry> = {
  bfs: {
    id: 'bfs',
    type: 'algorithm',
    name: 'Breadth-First Search',
    aliases: ['bfs', 'breadth first search'],
    definition: 'BFS explores nodes level-by-level using a queue.',
    intuition: 'Visit all neighbors at distance d before moving to distance d+1.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    useCases: ['Shortest path in unweighted graphs', 'Level-order traversal', 'Connectivity checks'],
    comparisons: [
      { with: 'dfs', summary: 'BFS uses a queue and explores broadly; DFS dives deeply with stack/recursion.' },
      { with: 'dijkstra', summary: 'BFS is equivalent to Dijkstra when every edge has equal weight.' }
    ],
    pitfalls: ['Using BFS on weighted graphs expecting weighted shortest paths.'],
    implementationNotes: ['Use visited set to avoid revisits.', 'Enqueue neighbors in consistent order for reproducible traces.'],
    optimizationTips: ['Use adjacency lists for sparse graphs.', 'Avoid recreating queue objects at each step.'],
    edgeCases: ['Disconnected graphs', 'Start node absent from adjacency map'],
    examples: ['Queue starts with source; dequeue, inspect neighbors, enqueue unseen nodes.']
  },
  dfs: {
    id: 'dfs',
    type: 'algorithm',
    name: 'Depth-First Search',
    aliases: ['dfs', 'depth first search'],
    definition: 'DFS explores as deep as possible before backtracking.',
    intuition: 'Follow one path until blocked, then unwind to the last branch point.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    useCases: ['Topological ordering foundation', 'Cycle detection', 'Connected components'],
    comparisons: [
      { with: 'bfs', summary: 'DFS is depth-oriented and memory-light on wide graphs; BFS gives shortest unweighted paths.' }
    ],
    pitfalls: ['Recursive DFS can overflow call stack on deep graphs.'],
    implementationNotes: ['Track visited nodes.', 'Use explicit stack in UI-heavy apps to avoid recursion depth limits.'],
    optimizationTips: ['Early-stop once target found.', 'Pre-sort neighbors if deterministic output is needed.'],
    edgeCases: ['Self-loops', 'Multiple disconnected components'],
    examples: ['Push source, pop node, push unvisited neighbors, backtrack when no neighbors remain.']
  },
  dijkstra: {
    id: 'dijkstra',
    type: 'algorithm',
    name: "Dijkstra's Algorithm",
    aliases: ['dijkstra', 'shortest path'],
    definition: 'Dijkstra finds shortest paths from a source in non-negative weighted graphs.',
    intuition: 'Repeatedly finalize the unvisited node with minimum known distance.',
    complexity: { time: 'O((V + E) log V) with heap', space: 'O(V)' },
    useCases: ['Network routing', 'Map navigation without heuristic', 'Cost minimization problems'],
    comparisons: [
      { with: 'astar', summary: 'A* adds heuristic guidance; Dijkstra is heuristic-free and explores more uniformly.' },
      { with: 'bfs', summary: 'Dijkstra generalizes BFS to weighted edges.' }
    ],
    pitfalls: ['Fails with negative edge weights.', 'Skipping priority queue updates can return stale distances.'],
    implementationNotes: ['Use min-priority queue keyed by distance.', 'Discard stale popped entries when they exceed current best distance.'],
    optimizationTips: ['Stop early when target node is finalized.', 'Use adjacency list and compact node IDs for memory efficiency.'],
    edgeCases: ['Unreachable target', 'Graphs with zero-weight edges'],
    examples: ['Initialize all distances to infinity except source; relax outgoing edges after each extract-min.']
  },
  astar: {
    id: 'astar',
    type: 'algorithm',
    name: 'A* Search',
    aliases: ['a*', 'a-star', 'astar'],
    definition: 'A* finds shortest paths using f(n) = g(n) + h(n).',
    intuition: 'Blend known path cost with estimated remaining cost to focus search.',
    complexity: { time: 'Worst-case exponential; often near Dijkstra bounds in practice', space: 'O(V)' },
    useCases: ['Game pathfinding', 'Route planning with geometric heuristics'],
    comparisons: [
      { with: 'dijkstra', summary: 'If h(n)=0 for all nodes, A* becomes Dijkstra.' },
      { with: 'bfs', summary: 'On unweighted grids with Manhattan heuristics, A* often explores fewer nodes than BFS.' }
    ],
    pitfalls: ['Non-admissible heuristics can break optimality.', 'Inconsistent heuristics may cause more reprocessing.'],
    implementationNotes: ['Maintain open and closed sets.', 'Store parent pointers to reconstruct path.'],
    optimizationTips: ['Use admissible/consistent heuristic.', 'Tie-break on lower h for smoother paths.'],
    edgeCases: ['No path to goal', 'Heuristic overestimation'],
    examples: ['Prioritize node with smallest f-score from open set each step.']
  },
  bubbleSort: {
    id: 'bubbleSort',
    type: 'algorithm',
    name: 'Bubble Sort',
    aliases: ['bubble sort'],
    definition: 'Bubble sort repeatedly swaps adjacent out-of-order elements.',
    intuition: 'Larger elements bubble to the end after each pass.',
    complexity: { time: 'O(n^2) average/worst, O(n) best with early exit', space: 'O(1)' },
    useCases: ['Teaching swap mechanics', 'Very small or nearly sorted arrays'],
    comparisons: [{ with: 'insertionSort', summary: 'Insertion sort generally performs fewer writes on nearly sorted inputs.' }],
    pitfalls: ['Inefficient on large lists without early-exit flag.'],
    implementationNotes: ['Track swap occurrence per pass to stop early.'],
    optimizationTips: ['Reduce inner-loop upper bound after each pass.'],
    edgeCases: ['Already sorted input', 'Duplicate values'],
    examples: ['Compare arr[j] and arr[j+1], swap if out of order.']
  },
  mergeSort: {
    id: 'mergeSort',
    type: 'algorithm',
    name: 'Merge Sort',
    aliases: ['merge sort'],
    definition: 'Merge sort recursively divides input and merges sorted halves.',
    intuition: 'Smaller sorted pieces are easy to combine into larger sorted ranges.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    useCases: ['Stable sorting', 'Linked list sorting', 'External sorting'],
    comparisons: [{ with: 'quickSort', summary: 'Merge sort has guaranteed O(n log n) but uses extra memory.' }],
    pitfalls: ['Extra memory allocations can hurt performance in tight loops.'],
    implementationNotes: ['Merge two sorted arrays with pointer walk.'],
    optimizationTips: ['Reuse auxiliary buffer.', 'Switch to insertion sort for tiny partitions.'],
    edgeCases: ['Odd-length splits', 'Many duplicate keys'],
    examples: ['Split until single elements, then merge while preserving order.']
  },
  quickSort: {
    id: 'quickSort',
    type: 'algorithm',
    name: 'Quick Sort',
    aliases: ['quick sort', 'quicksort'],
    definition: 'Quick sort partitions around a pivot, then sorts partitions recursively.',
    intuition: 'Place one pivot in final position, then solve smaller subproblems.',
    complexity: { time: 'O(n log n) average, O(n^2) worst', space: 'O(log n) average recursion stack' },
    useCases: ['In-place general-purpose sorting', 'Performance-critical average-case sorting'],
    comparisons: [{ with: 'mergeSort', summary: 'Quick sort is in-place on arrays but has worse worst-case complexity.' }],
    pitfalls: ['Bad pivot selection can degrade to O(n^2).'],
    implementationNotes: ['Partition schemes: Lomuto/Hoare.', 'Random or median pivot improves robustness.'],
    optimizationTips: ['Tail recursion elimination.', 'Fallback to insertion sort on small partitions.'],
    edgeCases: ['Many equal values', 'Already sorted arrays with naive pivot'],
    examples: ['Partition, recursively sort left and right partitions.']
  },
  binarySearch: {
    id: 'binarySearch',
    type: 'algorithm',
    name: 'Binary Search',
    aliases: ['binary search'],
    definition: 'Binary search halves a sorted search interval each step.',
    intuition: 'Use order to discard half the candidates every comparison.',
    complexity: { time: 'O(log n)', space: 'O(1) iterative' },
    useCases: ['Lookup in sorted arrays', 'Lower/upper bound queries'],
    comparisons: [{ with: 'linearSearch', summary: 'Binary search is asymptotically faster but requires sorted data.' }],
    pitfalls: ['Using on unsorted arrays.', 'Incorrect midpoint updates causing infinite loops.'],
    implementationNotes: ['Use mid = left + Math.floor((right - left) / 2).'],
    optimizationTips: ['Prefer iterative loop for stack safety.'],
    edgeCases: ['Target absent', 'Duplicate values and first/last occurrence variants'],
    examples: ['Compare with middle, move left or right boundary accordingly.']
  },
  array: {
    id: 'array',
    type: 'data-structure',
    name: 'Array',
    aliases: ['array'],
    definition: 'Array stores elements in contiguous logical positions accessible by index.',
    intuition: 'Jump directly to position i instead of following links.',
    complexity: { time: 'Access O(1), insert/delete O(n) middle', space: 'O(n)' },
    useCases: ['Random access', 'Dynamic list backing storage', 'Sorting/searching exercises'],
    comparisons: [{ with: 'linkedList', summary: 'Arrays excel at indexed access; linked lists excel at local insertion/deletion with pointer references.' }],
    pitfalls: ['Costly middle insertions/deletions due to shifts.'],
    implementationNotes: ['Use dynamic resizing strategy (e.g., doubling capacity) in low-level implementations.'],
    optimizationTips: ['Batch writes when possible.', 'Avoid repeated reallocation.'],
    edgeCases: ['Out-of-bounds indexing', 'Sparse arrays'],
    examples: ['arr[5] returns the sixth element in O(1) time.']
  },
  linkedList: {
    id: 'linkedList',
    type: 'data-structure',
    name: 'Linked List',
    aliases: ['linked list', 'linkedlist'],
    definition: 'Linked list stores nodes where each node references the next (and optionally previous).',
    intuition: 'Rewire links instead of shifting contiguous memory blocks.',
    complexity: { time: 'Insert/delete at known node O(1), search O(n)', space: 'O(n)' },
    useCases: ['Frequent insert/delete workloads', 'Implementing stacks/queues'],
    comparisons: [{ with: 'array', summary: 'Linked lists trade direct indexing for pointer flexibility.' }],
    pitfalls: ['Extra pointer memory overhead.', 'Poor cache locality.'],
    implementationNotes: ['Maintain head/tail references for efficient front/back operations.'],
    optimizationTips: ['Use doubly linked lists when reverse traversal is common.'],
    edgeCases: ['Empty list operations', 'Single-node deletion'],
    examples: ['Insert node by updating predecessor.next = newNode.']
  },
  stack: {
    id: 'stack',
    type: 'data-structure',
    name: 'Stack',
    aliases: ['stack'],
    definition: 'Stack is a LIFO structure: last in, first out.',
    intuition: 'Newest item sits on top and is removed first.',
    complexity: { time: 'Push/pop/peek O(1)', space: 'O(n)' },
    useCases: ['Function call management', 'Undo systems', 'DFS'],
    comparisons: [{ with: 'queue', summary: 'Stacks reverse order; queues preserve arrival order.' }],
    pitfalls: ['Stack underflow on pop from empty stack.'],
    implementationNotes: ['Top pointer/index tracks current element.'],
    optimizationTips: ['Use dynamic array backing for cache-friendly performance.'],
    edgeCases: ['Empty stack peek/pop'],
    examples: ['push(3), push(5), pop() returns 5.']
  },
  queue: {
    id: 'queue',
    type: 'data-structure',
    name: 'Queue',
    aliases: ['queue'],
    definition: 'Queue is a FIFO structure: first in, first out.',
    intuition: 'Process items in the same order they arrive.',
    complexity: { time: 'Enqueue/dequeue O(1)', space: 'O(n)' },
    useCases: ['Task scheduling', 'BFS frontier'],
    comparisons: [{ with: 'stack', summary: 'Queue preserves chronology; stack emphasizes recency.' }],
    pitfalls: ['Array-based shift operations can be O(n) if not using head index/circular buffer.'],
    implementationNotes: ['Use circular buffer or linked list for efficient dequeue.'],
    optimizationTips: ['Track head/tail indices instead of shifting elements.'],
    edgeCases: ['Dequeue from empty queue'],
    examples: ['enqueue(A), enqueue(B), dequeue() returns A.']
  },
  tree: {
    id: 'tree',
    type: 'data-structure',
    name: 'Tree',
    aliases: ['tree', 'binary tree'],
    definition: 'Tree is a hierarchical acyclic structure with parent-child relationships.',
    intuition: 'Represent nested relationships from root to leaves.',
    complexity: { time: 'Traversal O(n), balanced search O(log n) for BST variants', space: 'O(n)' },
    useCases: ['Hierarchical data', 'Indexing/search structures'],
    comparisons: [{ with: 'hashTable', summary: 'Trees can preserve order/range queries; hash tables optimize direct lookup.' }],
    pitfalls: ['Unbalanced trees degrade operations toward linear time.'],
    implementationNotes: ['Use recursion or explicit stack for traversal.'],
    optimizationTips: ['Use balanced tree variants for predictable performance.'],
    edgeCases: ['Null root', 'Skewed tree shapes'],
    examples: ['In-order traversal of BST visits keys in sorted order.']
  },
  hashTable: {
    id: 'hashTable',
    type: 'data-structure',
    name: 'Hash Table',
    aliases: ['hash table', 'hashmap', 'map'],
    definition: 'Hash table maps keys to buckets via hash function.',
    intuition: 'Convert key into index so lookup is near-constant on average.',
    complexity: { time: 'Average insert/find/delete O(1), worst O(n)', space: 'O(n)' },
    useCases: ['Dictionaries', 'Frequency counting', 'Caching'],
    comparisons: [{ with: 'tree', summary: 'Hash tables excel at exact lookups; trees handle ordered operations better.' }],
    pitfalls: ['Poor hash distribution causes collisions and slowdown.'],
    implementationNotes: ['Collision strategies: chaining or open addressing.', 'Resize when load factor grows too high.'],
    optimizationTips: ['Pick robust hash function and sensible load-factor threshold.'],
    edgeCases: ['Duplicate key updates', 'Deletion in open addressing schemes'],
    examples: ['Insert key-value pair by hashing key to bucket and resolving collisions.']
  }
};

validateKnowledgeBase(knowledgeBase);

export const knowledgeEntries = () => Object.values(knowledgeBase);

export const findKnowledgeEntry = (input: string, fallbackId?: string | null): KnowledgeEntry | null => {
  const normalized = input.toLowerCase();

  if (fallbackId && knowledgeBase[fallbackId]) {
    return knowledgeBase[fallbackId];
  }

  return (
    knowledgeEntries().find((entry) =>
      entry.aliases.some((alias) => normalized.includes(alias.toLowerCase())) ||
      normalized.includes(entry.name.toLowerCase())
    ) || null
  );
};
