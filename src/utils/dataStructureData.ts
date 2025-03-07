
import { 
  ListTree, 
  ListOrdered, 
  Hash, 
  GitBranch,
  BarChart2,
  GridIcon
} from 'lucide-react';

export interface DataStructure {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  operations: {
    name: string;
    timeComplexity: string;
    description: string;
  }[];
  implementation?: string;
  defaultExample: any;
}

export interface DSCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const dsCategories: DSCategory[] = [
  {
    id: 'linear',
    name: 'Linear Data Structures',
    description: 'Data structures where elements are arranged sequentially',
    icon: ListOrdered
  },
  {
    id: 'nonlinear',
    name: 'Non-Linear Data Structures',
    description: 'Data structures where elements are not arranged sequentially',
    icon: GitBranch
  },
  {
    id: 'hash',
    name: 'Hash-Based Structures',
    description: 'Data structures that use hash functions for storage and retrieval',
    icon: Hash
  },
  {
    id: 'tree',
    name: 'Tree Structures',
    description: 'Hierarchical data structures with nodes and edges',
    icon: ListTree
  },
  {
    id: 'graph',
    name: 'Graph Structures',
    description: 'Data structures that represent relationships between objects',
    icon: GridIcon
  },
  {
    id: 'advanced',
    name: 'Advanced Data Structures',
    description: 'Specialized data structures for specific operations',
    icon: BarChart2
  }
];

export const dataStructures: DataStructure[] = [
  {
    id: 'array',
    name: 'Array',
    category: 'linear',
    description: 'A collection of elements identified by index or key, stored in contiguous memory locations.',
    icon: ListOrdered,
    operations: [
      {
        name: 'Access',
        timeComplexity: 'O(1)',
        description: 'Retrieving an element at a given index'
      },
      {
        name: 'Search',
        timeComplexity: 'O(n)',
        description: 'Finding an element in the array'
      },
      {
        name: 'Insertion',
        timeComplexity: 'O(n)',
        description: 'Adding an element at a given position'
      },
      {
        name: 'Deletion',
        timeComplexity: 'O(n)',
        description: 'Removing an element from the array'
      }
    ],
    defaultExample: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    implementation: `// Array implementation in JavaScript
const array = [1, 2, 3, 4, 5];

// Access - O(1)
const element = array[2]; // Returns 3

// Search - O(n)
const findElement = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
};

// Insertion - O(n)
array.splice(2, 0, 10); // Inserts 10 at index 2
// Array becomes [1, 2, 10, 3, 4, 5]

// Deletion - O(n)
array.splice(3, 1); // Removes element at index 3
// Array becomes [1, 2, 10, 4, 5]`
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'linear',
    description: 'A sequential collection of elements, where each element points to the next, allowing efficient insertion and deletion.',
    icon: ListOrdered,
    operations: [
      {
        name: 'Access',
        timeComplexity: 'O(n)',
        description: 'Retrieving an element at a given position'
      },
      {
        name: 'Search',
        timeComplexity: 'O(n)',
        description: 'Finding an element in the linked list'
      },
      {
        name: 'Insertion',
        timeComplexity: 'O(1)',
        description: 'Adding an element at the beginning or end'
      },
      {
        name: 'Deletion',
        timeComplexity: 'O(1)',
        description: 'Removing an element from the beginning or end'
      }
    ],
    defaultExample: {
      nodes: [
        { value: 10, next: 1 },
        { value: 20, next: 2 },
        { value: 30, next: 3 },
        { value: 40, next: null }
      ],
      head: 0
    },
    implementation: `// Linked List implementation in JavaScript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // Add to end - O(n)
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    
    current.next = newNode;
    this.size++;
  }
  
  // Add to beginning - O(1)
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
  
  // Delete from beginning - O(1)
  deleteFirst() {
    if (!this.head) return;
    this.head = this.head.next;
    this.size--;
  }
  
  // Search - O(n)
  find(value) {
    let current = this.head;
    let index = 0;
    
    while (current) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }
    
    return -1;
  }
}`
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'linear',
    description: 'A Last In, First Out (LIFO) data structure that allows operations at one end only.',
    icon: ListOrdered,
    operations: [
      {
        name: 'Push',
        timeComplexity: 'O(1)',
        description: 'Adding an element to the top'
      },
      {
        name: 'Pop',
        timeComplexity: 'O(1)',
        description: 'Removing the top element'
      },
      {
        name: 'Peek',
        timeComplexity: 'O(1)',
        description: 'Viewing the top element without removing'
      },
      {
        name: 'Search',
        timeComplexity: 'O(n)',
        description: 'Finding an element in the stack'
      }
    ],
    defaultExample: [5, 4, 3, 2, 1],
    implementation: `// Stack implementation in JavaScript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Push - O(1)
  push(element) {
    this.items.push(element);
  }
  
  // Pop - O(1)
  pop() {
    if (this.isEmpty()) return "Stack is empty";
    return this.items.pop();
  }
  
  // Peek - O(1)
  peek() {
    if (this.isEmpty()) return "Stack is empty";
    return this.items[this.items.length - 1];
  }
  
  // IsEmpty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Size - O(1)
  size() {
    return this.items.length;
  }
}`
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    category: 'tree',
    description: 'A hierarchical data structure where each node has at most two children, left and right.',
    icon: ListTree,
    operations: [
      {
        name: 'Insertion',
        timeComplexity: 'O(log n)',
        description: 'Adding a new node to the tree'
      },
      {
        name: 'Deletion',
        timeComplexity: 'O(log n)',
        description: 'Removing a node from the tree'
      },
      {
        name: 'Search',
        timeComplexity: 'O(log n)',
        description: 'Finding a value in the tree'
      },
      {
        name: 'Traverse',
        timeComplexity: 'O(n)',
        description: 'Visiting all nodes in the tree'
      }
    ],
    defaultExample: {
      nodes: [
        { value: 50, left: 1, right: 2 },
        { value: 30, left: 3, right: 4 },
        { value: 70, left: 5, right: 6 },
        { value: 20, left: null, right: null },
        { value: 40, left: null, right: null },
        { value: 60, left: null, right: null },
        { value: 80, left: null, right: null }
      ],
      root: 0
    },
    implementation: `// Binary Search Tree implementation in JavaScript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // Insert - O(log n) average, O(n) worst
  insert(value) {
    const newNode = new Node(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    const insertNode = (node, newNode) => {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };
    
    insertNode(this.root, newNode);
  }
  
  // Search - O(log n) average, O(n) worst
  search(value) {
    const searchNode = (node, value) => {
      if (node === null) return false;
      
      if (node.value === value) return true;
      
      if (value < node.value) {
        return searchNode(node.left, value);
      } else {
        return searchNode(node.right, value);
      }
    };
    
    return searchNode(this.root, value);
  }
  
  // Inorder traversal - O(n)
  inOrderTraverse(callback) {
    const inOrder = (node, callback) => {
      if (node !== null) {
        inOrder(node.left, callback);
        callback(node.value);
        inOrder(node.right, callback);
      }
    };
    
    inOrder(this.root, callback);
  }
}`
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    category: 'hash',
    description: 'A data structure that maps keys to values for efficient lookup using a hash function.',
    icon: Hash,
    operations: [
      {
        name: 'Insert',
        timeComplexity: 'O(1) average',
        description: 'Adding a key-value pair'
      },
      {
        name: 'Delete',
        timeComplexity: 'O(1) average',
        description: 'Removing a key-value pair'
      },
      {
        name: 'Search',
        timeComplexity: 'O(1) average',
        description: 'Finding a value by key'
      }
    ],
    defaultExample: {
      buckets: [
        [{ key: "name", value: "John" }],
        [],
        [{ key: "age", value: 25 }],
        [],
        [{ key: "city", value: "New York" }, { key: "country", value: "USA" }]
      ]
    },
    implementation: `// Hash Table implementation in JavaScript
class HashTable {
  constructor(size = 53) {
    this.table = new Array(size);
    this.size = size;
  }
  
  // Simple hash function
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.size;
  }
  
  // Set key-value pair - O(1) average
  set(key, value) {
    const index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    
    // Check if key exists and update
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        this.table[index][i].value = value;
        return;
      }
    }
    
    // Key doesn't exist, add new key-value
    this.table[index].push({ key, value });
  }
  
  // Get value by key - O(1) average
  get(key) {
    const index = this.hash(key);
    if (!this.table[index]) return undefined;
    
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        return this.table[index][i].value;
      }
    }
    
    return undefined;
  }
  
  // Remove key-value pair - O(1) average
  remove(key) {
    const index = this.hash(key);
    if (!this.table[index]) return false;
    
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        this.table[index].splice(i, 1);
        return true;
      }
    }
    
    return false;
  }
}`
  }
];
