export interface TreeNode {
  value: any;
  left: number | null;
  right: number | null;
  status?: 'default' | 'current' | 'visited' | 'completed' | 'root' | 'final';
}

export interface BinaryTreeStructure {
  nodes: TreeNode[];
  root: number | null;
}

// Track previous generations to ensure variety
let lastGeneratedType: string | null = null;
let generationSeed = Date.now();

export const generateRandomTree = (): BinaryTreeStructure => {
  // Increment seed to ensure different results each time
  generationSeed += Math.floor(Math.random() * 1000) + 1;
  
  const treeTypes = ['family', 'organization', 'filesystem'];
  // Avoid repeating the same type consecutively
  const availableTypes = lastGeneratedType 
    ? treeTypes.filter(type => type !== lastGeneratedType)
    : treeTypes;
  
  const treeType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  lastGeneratedType = treeType;
  
  switch (treeType) {
    case 'family':
      return generateFamilyTree();
    case 'organization':
      return generateOrgTree();
    case 'filesystem':
      return generateFileSystemTree();
    default:
      return generateFamilyTree();
  }
};

const generateFamilyTree = (): BinaryTreeStructure => {
  const families = [
    {
      root: 'Grandpa John',
      children: [
        { name: 'Father Mike', children: [{ name: 'Son Alex' }, { name: 'Daughter Emma' }] },
        { name: 'Uncle Tom', children: [{ name: 'Cousin Jake' }, { name: 'Nephew Ben' }] }
      ]
    },
    {
      root: 'Grandma Mary',
      children: [
        { name: 'Mother Lisa', children: [{ name: 'Son David' }, { name: 'Daughter Sarah' }] },
        { name: 'Aunt Kate', children: [{ name: 'Cousin Lily' }, { name: 'Cousin Max' }] }
      ]
    },
    {
      root: 'Great-Grandpa William',
      children: [
        { name: 'Dad Robert', children: [{ name: 'Brother Sam' }, { name: 'Sister Anna' }] },
        { name: 'Uncle George', children: [{ name: 'Cousin Mark' }] }
      ]
    },
    {
      root: 'Elder Patricia',
      children: [
        { name: 'Mom Jennifer', children: [{ name: 'Son Luke' }, { name: 'Daughter Maya' }] },
        { name: 'Aunt Rachel', children: [{ name: 'Cousin Noah' }, { name: 'Cousin Zoe' }] }
      ]
    }
  ];
  
  // Use seed-based randomization for consistent variety
  const familyIndex = Math.abs(generationSeed) % families.length;
  
  const family = families[familyIndex];
  const nodes: TreeNode[] = [];
  
  // Add root
  nodes.push({ value: family.root, left: null, right: null });
  
  // Add children recursively
  let nodeIndex = 0;
  family.children.forEach((child, index) => {
    const childIndex = nodes.length;
    nodes.push({ value: child.name, left: null, right: null });
    
    if (index === 0) {
      nodes[nodeIndex].left = childIndex;
    } else {
      nodes[nodeIndex].right = childIndex;
    }
    
    // Add grandchildren
    child.children?.forEach((grandchild, gIndex) => {
      const grandchildIndex = nodes.length;
      nodes.push({ value: grandchild.name, left: null, right: null });
      
      if (gIndex === 0) {
        nodes[childIndex].left = grandchildIndex;
      } else {
        nodes[childIndex].right = grandchildIndex;
      }
    });
  });
  
  return { nodes, root: 0 };
};

const generateOrgTree = (): BinaryTreeStructure => {
  const orgs = [
    {
      root: 'CEO Sarah',
      children: [
        { name: 'CTO John', children: [{ name: 'Dev Lead Alice' }, { name: 'QA Lead Bob' }] },
        { name: 'CFO Maria', children: [{ name: 'Accountant Tom' }, { name: 'Finance Lead Jane' }] }
      ]
    },
    {
      root: 'Director Alex',
      children: [
        { name: 'Manager Kate', children: [{ name: 'Team Lead Mike' }, { name: 'Sr Dev Lisa' }] },
        { name: 'Manager Jim', children: [{ name: 'Analyst Amy' }, { name: 'Designer Sam' }] }
      ]
    },
    {
      root: 'President Rebecca',
      children: [
        { name: 'VP Engineering', children: [{ name: 'Architect James' }, { name: 'DevOps Lead Carol' }] },
        { name: 'VP Sales', children: [{ name: 'Sales Manager Paul' }, { name: 'Account Exec Helen' }] }
      ]
    },
    {
      root: 'Chairman David',
      children: [
        { name: 'COO Michael', children: [{ name: 'Operations Lead Emma' }, { name: 'Process Manager Tyler' }] },
        { name: 'CMO Sophie', children: [{ name: 'Marketing Lead Oliver' }] }
      ]
    }
  ];
  
  const orgIndex = Math.abs(generationSeed * 3) % orgs.length;
  
  const org = orgs[orgIndex];
  const nodes: TreeNode[] = [];
  
  // Add root
  nodes.push({ value: org.root, left: null, right: null });
  
  // Add children recursively
  let nodeIndex = 0;
  org.children.forEach((child, index) => {
    const childIndex = nodes.length;
    nodes.push({ value: child.name, left: null, right: null });
    
    if (index === 0) {
      nodes[nodeIndex].left = childIndex;
    } else {
      nodes[nodeIndex].right = childIndex;
    }
    
    // Add team members
    child.children?.forEach((member, mIndex) => {
      const memberIndex = nodes.length;
      nodes.push({ value: member.name, left: null, right: null });
      
      if (mIndex === 0) {
        nodes[childIndex].left = memberIndex;
      } else {
        nodes[childIndex].right = memberIndex;
      }
    });
  });
  
  return { nodes, root: 0 };
};

const generateFileSystemTree = (): BinaryTreeStructure => {
  const filesystems = [
    {
      root: 'Documents',
      children: [
        { name: 'Work', children: [{ name: 'Reports.docx' }, { name: 'Budget.xlsx' }] },
        { name: 'Personal', children: [{ name: 'Photos' }, { name: 'Music' }] }
      ]
    },
    {
      root: 'Projects',
      children: [
        { name: 'WebApp', children: [{ name: 'src' }, { name: 'dist' }] },
        { name: 'MobileApp', children: [{ name: 'android' }, { name: 'ios' }] }
      ]
    },
    {
      root: 'System',
      children: [
        { name: 'bin', children: [{ name: 'bash' }, { name: 'python' }] },
        { name: 'etc', children: [{ name: 'config' }, { name: 'hosts' }] }
      ]
    },
    {
      root: 'Users',
      children: [
        { name: 'admin', children: [{ name: 'Desktop' }, { name: 'Downloads' }] },
        { name: 'guest', children: [{ name: 'temp' }, { name: 'cache' }] }
      ]
    }
  ];
  
  const fsIndex = Math.abs(generationSeed * 7) % filesystems.length;
  
  const fs = filesystems[fsIndex];
  const nodes: TreeNode[] = [];
  
  // Add root
  nodes.push({ value: fs.root, left: null, right: null });
  
  // Add children recursively
  let nodeIndex = 0;
  fs.children.forEach((child, index) => {
    const childIndex = nodes.length;
    nodes.push({ value: child.name, left: null, right: null });
    
    if (index === 0) {
      nodes[nodeIndex].left = childIndex;
    } else {
      nodes[nodeIndex].right = childIndex;
    }
    
    // Add sub-files/folders
    child.children?.forEach((subItem, sIndex) => {
      const subIndex = nodes.length;
      nodes.push({ value: subItem.name, left: null, right: null });
      
      if (sIndex === 0) {
        nodes[childIndex].left = subIndex;
      } else {
        nodes[childIndex].right = subIndex;
      }
    });
  });
  
  return { nodes, root: 0 };
};

// Tree traversal visualization generators
export const generateInorderTraversal = (tree: BinaryTreeStructure): any[] => {
  const steps: any[] = [];
  
  const inorderHelper = (nodeIndex: number | null) => {
    if (nodeIndex === null || !tree.nodes[nodeIndex]) return;
    
    const node = tree.nodes[nodeIndex];
    
    // Process left subtree
    if (node.left !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === nodeIndex ? 'current' : i === node.left ? 'visited' : 'default'
        })),
        description: `Visiting left child of ${node.value}`
      });
      inorderHelper(node.left);
    }
    
    // Process current node
    steps.push({
      nodes: tree.nodes.map((n, i) => ({
        ...n,
        status: i === nodeIndex ? 'completed' : 'default'
      })),
      description: `Processing ${node.value}`
    });
    
    // Process right subtree
    if (node.right !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === nodeIndex ? 'current' : i === node.right ? 'visited' : 'default'
        })),
        description: `Visiting right child of ${node.value}`
      });
      inorderHelper(node.right);
    }
  };
  
  if (tree.root !== null) {
    inorderHelper(tree.root);
  }
  
  return steps;
};

export const generatePreorderTraversal = (tree: BinaryTreeStructure): any[] => {
  const steps: any[] = [];
  
  const preorderHelper = (nodeIndex: number | null) => {
    if (nodeIndex === null || !tree.nodes[nodeIndex]) return;
    
    const node = tree.nodes[nodeIndex];
    
    // Process current node first
    steps.push({
      nodes: tree.nodes.map((n, i) => ({
        ...n,
        status: i === nodeIndex ? 'completed' : 'default'
      })),
      description: `Processing ${node.value}`
    });
    
    // Process left subtree
    if (node.left !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === node.left ? 'current' : 'default'
        })),
        description: `Visiting left child of ${node.value}`
      });
      preorderHelper(node.left);
    }
    
    // Process right subtree
    if (node.right !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === node.right ? 'current' : 'default'
        })),
        description: `Visiting right child of ${node.value}`
      });
      preorderHelper(node.right);
    }
  };
  
  if (tree.root !== null) {
    preorderHelper(tree.root);
  }
  
  return steps;
};

export const generatePostorderTraversal = (tree: BinaryTreeStructure): any[] => {
  const steps: any[] = [];
  
  const postorderHelper = (nodeIndex: number | null) => {
    if (nodeIndex === null || !tree.nodes[nodeIndex]) return;
    
    const node = tree.nodes[nodeIndex];
    
    // Process left subtree
    if (node.left !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === node.left ? 'current' : 'default'
        })),
        description: `Visiting left child of ${node.value}`
      });
      postorderHelper(node.left);
    }
    
    // Process right subtree
    if (node.right !== null) {
      steps.push({
        nodes: tree.nodes.map((n, i) => ({
          ...n,
          status: i === node.right ? 'current' : 'default'
        })),
        description: `Visiting right child of ${node.value}`
      });
      postorderHelper(node.right);
    }
    
    // Process current node last
    steps.push({
      nodes: tree.nodes.map((n, i) => ({
        ...n,
        status: i === nodeIndex ? 'completed' : 'default'
      })),
      description: `Processing ${node.value}`
    });
  };
  
  if (tree.root !== null) {
    postorderHelper(tree.root);
  }
  
  return steps;
};

export const generateBFSTraversal = (tree: BinaryTreeStructure): any[] => {
  const steps: any[] = [];
  
  if (tree.root === null) return steps;
  
  const queue: number[] = [tree.root];
  const visited: Set<number> = new Set();
  
  while (queue.length > 0) {
    const currentIndex = queue.shift()!;
    const currentNode = tree.nodes[currentIndex];
    
    visited.add(currentIndex);
    
    steps.push({
      nodes: tree.nodes.map((n, i) => ({
        ...n,
        status: i === currentIndex ? 'completed' : visited.has(i) ? 'visited' : 'default'
      })),
      description: `Processing ${currentNode.value} (BFS level-order)`
    });
    
    // Add children to queue
    if (currentNode.left !== null) {
      queue.push(currentNode.left);
    }
    if (currentNode.right !== null) {
      queue.push(currentNode.right);
    }
  }
  
  return steps;
};