
import { Database } from 'lucide-react';

export interface Operation {
  name: string;
  timeComplexity: string;
  description?: string;
}

export interface DataStructure {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  defaultExample: any;
  operations: Operation[];
  implementation?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}

export const dsCategories: Category[] = [
  { id: 'linear', name: 'Linear', icon: Database },
  { id: 'hierarchical', name: 'Trees', icon: Database },
  { id: 'graph', name: 'Graphs', icon: Database },
  { id: 'hashing', name: 'Hashing', icon: Database }
];

export const dataStructures: DataStructure[] = [
  {
    id: 'array',
    name: 'Array',
    description: 'A collection of elements stored in contiguous memory locations',
    category: 'linear',
    icon: null,
    defaultExample: [10, 20, 30, 40, 50],
    operations: [
      { name: 'Access', timeComplexity: 'O(1)' },
      { name: 'Search', timeComplexity: 'O(n)' },
      { name: 'Insert', timeComplexity: 'O(n)' },
      { name: 'Delete', timeComplexity: 'O(n)' }
    ],
    implementation: `
class Array {
  constructor() {
    this.data = [];
  }
  
  add(element) {
    this.data.push(element);
  }
  
  remove() {
    return this.data.pop();
  }
  
  search(element) {
    return this.data.indexOf(element);
  }
}
    `
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    description: 'A linear data structure where elements are stored in nodes',
    category: 'linear',
    icon: null,
    defaultExample: {
      nodes: [
        { value: 10, next: 1 },
        { value: 20, next: 2 },
        { value: 30, next: null }
      ],
      head: 0
    },
    operations: [
      { name: 'Insert', timeComplexity: 'O(1)' },
      { name: 'Delete', timeComplexity: 'O(n)' },
      { name: 'Search', timeComplexity: 'O(n)' },
      { name: 'Traverse', timeComplexity: 'O(n)' }
    ],
    implementation: `
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insert(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }
}
    `
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'LIFO (Last In, First Out) data structure',
    category: 'linear',
    icon: null,
    defaultExample: [30, 20, 10],
    operations: [
      { name: 'Push', timeComplexity: 'O(1)' },
      { name: 'Pop', timeComplexity: 'O(1)' },
      { name: 'Peek', timeComplexity: 'O(1)' },
      { name: 'IsEmpty', timeComplexity: 'O(1)' }
    ],
    implementation: `
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
}
    `
  },
  {
    id: 'queue',
    name: 'Queue',
    description: 'FIFO (First In, First Out) data structure',
    category: 'linear',
    icon: null,
    defaultExample: [10, 20, 30],
    operations: [
      { name: 'Enqueue', timeComplexity: 'O(1)' },
      { name: 'Dequeue', timeComplexity: 'O(1)' },
      { name: 'Front', timeComplexity: 'O(1)' },
      { name: 'IsEmpty', timeComplexity: 'O(1)' }
    ],
    implementation: `
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    return this.items.shift();
  }
  
  front() {
    return this.items[0];
  }
}
    `
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    description: 'A hierarchical data structure with at most two children per node',
    category: 'hierarchical',
    icon: null,
    defaultExample: {
      nodes: [
        { value: 50, left: 1, right: 2 },
        { value: 30, left: 3, right: 4 },
        { value: 70, left: null, right: null },
        { value: 20, left: null, right: null },
        { value: 40, left: null, right: null }
      ],
      root: 0
    },
    operations: [
      { name: 'Insert', timeComplexity: 'O(log n)' },
      { name: 'Delete', timeComplexity: 'O(log n)' },
      { name: 'Search', timeComplexity: 'O(log n)' },
      { name: 'Traverse', timeComplexity: 'O(n)' }
    ],
    implementation: `
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    this.root = this.insertNode(this.root, val);
  }
  
  insertNode(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else {
      node.right = this.insertNode(node.right, val);
    }
    return node;
  }
}
    `
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    description: 'Key-value pairs with fast lookup using hash functions',
    category: 'hashing',
    icon: null,
    defaultExample: [
      [{ key: 'name', value: 'John' }],
      [],
      [{ key: 'age', value: 25 }],
      [{ key: 'city', value: 'NYC' }],
      []
    ],
    operations: [
      { name: 'Set', timeComplexity: 'O(1)' },
      { name: 'Get', timeComplexity: 'O(1)' },
      { name: 'Delete', timeComplexity: 'O(1)' },
      { name: 'Keys', timeComplexity: 'O(n)' }
    ],
    implementation: `
class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }
  
  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }
  
  set(key, value) {
    const index = this.hash(key);
    this.table[index].push({ key, value });
  }
}
    `
  },
  {
    id: 'graph',
    name: 'Graph',
    description: 'A collection of vertices connected by edges',
    category: 'graph',
    icon: null,
    defaultExample: {
      nodes: [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 200, y: 50 },
        { id: 'C', x: 300, y: 100 },
        { id: 'D', x: 200, y: 150 },
        { id: 'E', x: 150, y: 200 },
        { id: 'F', x: 250, y: 200 }
      ],
      edges: [
        { source: 'A', target: 'B', weight: 4 },
        { source: 'A', target: 'D', weight: 2 },
        { source: 'B', target: 'C', weight: 3 },
        { source: 'B', target: 'D', weight: 1 },
        { source: 'C', target: 'F', weight: 2 },
        { source: 'D', target: 'E', weight: 3 },
        { source: 'E', target: 'F', weight: 1 }
      ]
    },
    operations: [
      { name: 'Add Vertex', timeComplexity: 'O(1)' },
      { name: 'Add Edge', timeComplexity: 'O(1)' },
      { name: 'BFS', timeComplexity: 'O(V+E)' },
      { name: 'DFS', timeComplexity: 'O(V+E)' }
    ],
    implementation: `
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
}
    `
  }
];
