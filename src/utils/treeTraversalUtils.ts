export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  status?: 'default' | 'visiting' | 'visited' | 'found';
}

export interface TraversalStep {
  node: TreeNode;
  description: string;
}

// 🔥 STRICT: Async traversal functions with delays for animation
export async function inorderTraversal(node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> {
  if (!node) return;
  
  // Left → Node → Right
  await inorderTraversal(node.left || null, visit);
  await visit(node);
  await inorderTraversal(node.right || null, visit);
}

export async function preorderTraversal(node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> {
  if (!node) return;
  
  // Node → Left → Right
  await visit(node);
  await preorderTraversal(node.left || null, visit);
  await preorderTraversal(node.right || null, visit);
}

export async function postorderTraversal(node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> {
  if (!node) return;
  
  // Left → Right → Node
  await postorderTraversal(node.left || null, visit);
  await postorderTraversal(node.right || null, visit);
  await visit(node);
}

// 🔥 STRICT: Generate result array for display
export function getTraversalResult(root: TreeNode | null, type: 'inorder' | 'preorder' | 'postorder'): number[] {
  const result: number[] = [];
  
  const inorderSync = (node: TreeNode | null): void => {
    if (!node) return;
    inorderSync(node.left || null);
    result.push(node.value);
    inorderSync(node.right || null);
  };
  
  const preorderSync = (node: TreeNode | null): void => {
    if (!node) return;
    result.push(node.value);
    preorderSync(node.left || null);
    preorderSync(node.right || null);
  };
  
  const postorderSync = (node: TreeNode | null): void => {
    if (!node) return;
    postorderSync(node.left || null);
    postorderSync(node.right || null);
    result.push(node.value);
  };
  
  if (type === 'inorder') {
    inorderSync(root);
  } else if (type === 'preorder') {
    preorderSync(root);
  } else {
    postorderSync(root);
  }
  
  return result;
}

// 🔥 STRICT: Validation functions
export function countNodes(tree: TreeNode | null): number {
  if (!tree) return 0;
  return 1 + countNodes(tree.left || null) + countNodes(tree.right || null);
}

export function isBalanced(tree: TreeNode | null): boolean {
  if (!tree) return true;
  
  const getHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left || null), getHeight(node.right || null));
  };
  
  const leftHeight = getHeight(tree.left || null);
  const rightHeight = getHeight(tree.right || null);
  
  return Math.abs(leftHeight - rightHeight) <= 1 && 
         isBalanced(tree.left || null) && 
         isBalanced(tree.right || null);
}