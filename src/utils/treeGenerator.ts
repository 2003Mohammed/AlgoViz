// Enhanced tree generation utilities with realistic examples

export interface TreeNode {
  value: any;
  left: number | null;
  right: number | null;
  status?: 'default' | 'current' | 'visited' | 'completed' | 'root' | 'final';
}

export interface TreeStructure {
  nodes: TreeNode[];
  root: number | null;
  type: 'family' | 'organization' | 'file-system' | 'decision' | 'binary-search';
}

// Family tree examples
const familyTreeExamples = [
  {
    nodes: [
      { value: 'Grandpa John', left: 1, right: 2 },
      { value: 'Dad Mike', left: 3, right: 4 },
      { value: 'Uncle Tom', left: 5, right: null },
      { value: 'You', left: null, right: null },
      { value: 'Sister Amy', left: null, right: null },
      { value: 'Cousin Sam', left: null, right: null }
    ],
    root: 0,
    type: 'family' as const
  },
  {
    nodes: [
      { value: 'Great-Grandma', left: 1, right: 2 },
      { value: 'Grandma Alice', left: 3, right: 4 },
      { value: 'Grandpa Bob', left: 5, right: null },
      { value: 'Mom Sarah', left: 6, right: 7 },
      { value: 'Aunt Lisa', left: null, right: null },
      { value: 'Uncle Mark', left: null, right: null },
      { value: 'Brother Jake', left: null, right: null },
      { value: 'You', left: null, right: null }
    ],
    root: 0,
    type: 'family' as const
  }
];

// Organization structure examples
const organizationExamples = [
  {
    nodes: [
      { value: 'CEO', left: 1, right: 2 },
      { value: 'CTO', left: 3, right: 4 },
      { value: 'CFO', left: 5, right: null },
      { value: 'Dev Lead', left: null, right: null },
      { value: 'QA Lead', left: null, right: null },
      { value: 'Accountant', left: null, right: null }
    ],
    root: 0,
    type: 'organization' as const
  },
  {
    nodes: [
      { value: 'Director', left: 1, right: 2 },
      { value: 'Engineering', left: 3, right: 4 },
      { value: 'Marketing', left: 5, right: 6 },
      { value: 'Frontend', left: null, right: null },
      { value: 'Backend', left: null, right: null },
      { value: 'Social Media', left: null, right: null },
      { value: 'Content', left: null, right: null }
    ],
    root: 0,
    type: 'organization' as const
  }
];

// File system examples
const fileSystemExamples = [
  {
    nodes: [
      { value: 'Documents/', left: 1, right: 2 },
      { value: 'Projects/', left: 3, right: 4 },
      { value: 'Photos/', left: 5, right: null },
      { value: 'AlgoViz/', left: null, right: null },
      { value: 'Website/', left: null, right: null },
      { value: 'Vacation/', left: null, right: null }
    ],
    root: 0,
    type: 'file-system' as const
  },
  {
    nodes: [
      { value: 'Home/', left: 1, right: 2 },
      { value: 'Desktop/', left: 3, right: null },
      { value: 'Downloads/', left: 4, right: 5 },
      { value: 'Apps/', left: null, right: null },
      { value: 'Music/', left: null, right: null },
      { value: 'Videos/', left: null, right: null }
    ],
    root: 0,
    type: 'file-system' as const
  }
];

// Decision tree examples
const decisionTreeExamples = [
  {
    nodes: [
      { value: 'Hungry?', left: 1, right: 2 },
      { value: 'Cook?', left: 3, right: 4 },
      { value: 'Study', left: null, right: null },
      { value: 'Make Food', left: null, right: null },
      { value: 'Order Food', left: null, right: null }
    ],
    root: 0,
    type: 'decision' as const
  },
  {
    nodes: [
      { value: 'Weekend?', left: 1, right: 2 },
      { value: 'Sunny?', left: 3, right: 4 },
      { value: 'Work', left: null, right: null },
      { value: 'Go Outside', left: null, right: null },
      { value: 'Stay Home', left: null, right: null }
    ],
    root: 0,
    type: 'decision' as const
  }
];

// Binary search tree examples with numbers
const binarySearchExamples = [
  {
    nodes: [
      { value: 50, left: 1, right: 2 },
      { value: 30, left: 3, right: 4 },
      { value: 70, left: 5, right: 6 },
      { value: 20, left: null, right: null },
      { value: 40, left: null, right: null },
      { value: 60, left: null, right: null },
      { value: 80, left: null, right: null }
    ],
    root: 0,
    type: 'binary-search' as const
  },
  {
    nodes: [
      { value: 25, left: 1, right: 2 },
      { value: 15, left: 3, right: 4 },
      { value: 35, left: 5, right: 6 },
      { value: 10, left: null, right: null },
      { value: 22, left: null, right: null },
      { value: 28, left: null, right: null },
      { value: 45, left: null, right: null }
    ],
    root: 0,
    type: 'binary-search' as const
  }
];

// Generate a random tree example
export function generateRandomTree(): TreeStructure {
  const allExamples = [
    ...familyTreeExamples,
    ...organizationExamples,
    ...fileSystemExamples,
    ...decisionTreeExamples,
    ...binarySearchExamples
  ];
  
  const randomExample = allExamples[Math.floor(Math.random() * allExamples.length)];
  
  // Deep clone to avoid mutations
  return {
    nodes: randomExample.nodes.map(node => ({ ...node, status: 'default' })),
    root: randomExample.root,
    type: randomExample.type
  };
}

// Generate a balanced BST with random values
export function generateRandomBST(size: number = 7): TreeStructure {
  const values = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
  values.sort((a, b) => a - b);
  
  function buildBalancedBST(sortedValues: number[]): { nodes: TreeNode[], root: number | null } {
    if (sortedValues.length === 0) return { nodes: [], root: null };
    
    const nodes: TreeNode[] = [];
    
    function build(start: number, end: number): number | null {
      if (start > end) return null;
      
      const mid = Math.floor((start + end) / 2);
      const nodeIndex = nodes.length;
      
      nodes.push({
        value: sortedValues[mid],
        left: null,
        right: null,
        status: 'default'
      });
      
      nodes[nodeIndex].left = build(start, mid - 1);
      nodes[nodeIndex].right = build(mid + 1, end);
      
      return nodeIndex;
    }
    
    const rootIndex = build(0, sortedValues.length - 1);
    return { nodes, root: rootIndex };
  }
  
  const result = buildBalancedBST(values);
  return {
    nodes: result.nodes,
    root: result.root,
    type: 'binary-search'
  };
}

// Get tree traversal steps
export function getTraversalSteps(tree: TreeStructure, traversalType: 'inorder' | 'preorder' | 'postorder' | 'bfs') {
  const steps: Array<{ nodes: TreeNode[], description: string, currentNode?: number }> = [];
  const { nodes, root } = tree;
  
  if (root === null) return steps;
  
  // Initial state
  steps.push({
    nodes: nodes.map(n => ({ ...n, status: 'default' })),
    description: `Starting ${traversalType} traversal`,
  });
  
  const workingNodes = nodes.map(n => ({ ...n }));
  
  if (traversalType === 'bfs') {
    const queue = [root];
    const visited: number[] = [];
    
    while (queue.length > 0) {
      const currentIndex = queue.shift()!;
      const currentNode = workingNodes[currentIndex];
      
      // Mark as current
      workingNodes[currentIndex].status = 'current';
      steps.push({
        nodes: workingNodes.map(n => ({ ...n })),
        description: `Visiting node: ${currentNode.value}`,
        currentNode: currentIndex
      });
      
      visited.push(currentIndex);
      
      // Mark as visited
      workingNodes[currentIndex].status = 'visited';
      
      // Add children to queue
      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
      
      steps.push({
        nodes: workingNodes.map(n => ({ ...n })),
        description: `Node ${currentNode.value} processed, added children to queue`,
      });
    }
  } else {
    // DFS traversals
    function traverse(nodeIndex: number | null): void {
      if (nodeIndex === null) return;
      
      const node = workingNodes[nodeIndex];
      
      if (traversalType === 'preorder') {
        // Visit root first
        workingNodes[nodeIndex].status = 'current';
        steps.push({
          nodes: workingNodes.map(n => ({ ...n })),
          description: `Visiting node: ${node.value}`,
          currentNode: nodeIndex
        });
        
        workingNodes[nodeIndex].status = 'visited';
        
        // Then left and right
        traverse(node.left);
        traverse(node.right);
      } else if (traversalType === 'inorder') {
        // Left first
        traverse(node.left);
        
        // Then visit root
        workingNodes[nodeIndex].status = 'current';
        steps.push({
          nodes: workingNodes.map(n => ({ ...n })),
          description: `Visiting node: ${node.value}`,
          currentNode: nodeIndex
        });
        
        workingNodes[nodeIndex].status = 'visited';
        
        // Then right
        traverse(node.right);
      } else if (traversalType === 'postorder') {
        // Left and right first
        traverse(node.left);
        traverse(node.right);
        
        // Then visit root
        workingNodes[nodeIndex].status = 'current';
        steps.push({
          nodes: workingNodes.map(n => ({ ...n })),
          description: `Visiting node: ${node.value}`,
          currentNode: nodeIndex
        });
        
        workingNodes[nodeIndex].status = 'visited';
      }
    }
    
    traverse(root);
  }
  
  // Final state
  workingNodes.forEach(node => {
    if (node.status === 'visited') {
      node.status = 'completed';
    }
  });
  
  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    description: `${traversalType} traversal completed!`
  });
  
  return steps;
}