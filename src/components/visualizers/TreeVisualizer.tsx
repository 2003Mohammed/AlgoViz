import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Play, Pause, SkipForward, RotateCcw, Plus, Minus, Search, ExternalLink, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  status?: 'default' | 'visiting' | 'visited' | 'found' | 'adding' | 'removing';
  highlighted?: boolean;
}

interface TreePosition {
  x: number;
  y: number;
}

const TreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [treeType, setTreeType] = useState<'binary' | 'bst'>('bst');
  const [nodeValue, setNodeValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<{ node: TreeNode; description: string }[]>([]);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [error, setError] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => setError('');

  // Helper function to create a new node
  const createNode = (value: number): TreeNode => ({
    value,
    left: null,
    right: null,
    status: 'default'
  });

  // Generate example tree
  const generateExample = () => {
    const values = treeType === 'bst' ? [50, 30, 70, 20, 40, 60, 80] : [1, 2, 3, 4, 5, 6, 7];
    let newRoot: TreeNode | null = null;
    
    values.forEach(value => {
      newRoot = insertNode(newRoot, value);
    });
    
    setRoot(newRoot);
    setAnimationSteps([]);
    setCurrentStep(0);
    setTraversalResult([]);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  // Erase tree
  const eraseExample = () => {
    setRoot(null);
    setAnimationSteps([]);
    setCurrentStep(0);
    setTraversalResult([]);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  // Insert node into tree
  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
      return createNode(value);
    }

    if (treeType === 'bst') {
      if (value < node.value) {
        node.left = insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = insertNode(node.right, value);
      }
    } else {
      // Binary tree - insert level by level
      if (!node.left) {
        node.left = createNode(value);
      } else if (!node.right) {
        node.right = createNode(value);
      } else {
        // Continue with left subtree for simplicity
        node.left = insertNode(node.left, value);
      }
    }

    return node;
  };

  // Handle insert
  const handleInsert = () => {
    const value = parseInt(nodeValue.trim());
    
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (treeType === 'bst' && findNode(root, value)) {
      setError('Value already exists in BST');
      return;
    }

    resetError();
    const newRoot = insertNode(root, value);
    setRoot(newRoot);
    setNodeValue('');
  };

  // Find node in tree
  const findNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) return null;
    if (node.value === value) return node;
    
    if (treeType === 'bst') {
      if (value < node.value) {
        return findNode(node.left, value);
      } else {
        return findNode(node.right, value);
      }
    } else {
      return findNode(node.left, value) || findNode(node.right, value);
    }
  };

  // Delete node from tree
  const deleteNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) return null;

    if (value < node.value) {
      node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNode(node.right, value);
    } else {
      // Node to be deleted found
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node with two children
      const minRight = findMin(node.right);
      node.value = minRight.value;
      node.right = deleteNode(node.right, minRight.value);
    }

    return node;
  };

  // Find minimum value node
  const findMin = (node: TreeNode): TreeNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Handle delete
  const handleDelete = () => {
    const value = parseInt(deleteValue.trim());
    
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (!findNode(root, value)) {
      setError('Value not found in tree');
      return;
    }

    resetError();
    const newRoot = deleteNode(root, value);
    setRoot(newRoot);
    setDeleteValue('');
  };

  // Handle search with animation
  const handleSearch = () => {
    const value = parseInt(searchValue.trim());
    
    if (isNaN(value)) {
      setError('Please enter a valid number to search');
      return;
    }

    if (!root) {
      setError('Tree is empty');
      return;
    }

    resetError();
    const searchPath: TreeNode[] = [];
    searchNodeAnimated(root, value, searchPath);
    
    if (searchPath.length > 0) {
      setAnimationSteps(searchPath);
      setCurrentStep(0);
      setIsAnimating(true);
      setIsPaused(false);
    }
    
    setSearchValue('');
  };

  // Animated search
  const searchNodeAnimated = (node: TreeNode | null, value: number, path: TreeNode[]) => {
    if (!node) return;
    
    const nodeCopy = { ...node, status: 'visiting' as const };
    path.push(nodeCopy);
    
    if (node.value === value) {
      const foundNode = { ...node, status: 'found' as const };
      path.push(foundNode);
      return;
    }
    
    if (treeType === 'bst') {
      if (value < node.value && node.left) {
        searchNodeAnimated(node.left, value, path);
      } else if (value > node.value && node.right) {
        searchNodeAnimated(node.right, value, path);
      }
    }
  };

  // Enhanced traversal functions with step descriptions
  const inorderTraversalWithSteps = (node: TreeNode | null, steps: { node: TreeNode; description: string }[] = []): number[] => {
    const result: number[] = [];
    
    const traverse = (currentNode: TreeNode | null) => {
      if (currentNode) {
        if (currentNode.left) traverse(currentNode.left);
        
        steps.push({ 
          node: { ...currentNode }, 
          description: `Visiting node ${currentNode.value} (Inorder: Left → Root → Right)` 
        });
        result.push(currentNode.value);
        
        if (currentNode.right) traverse(currentNode.right);
      }
    };
    
    traverse(node);
    return result;
  };

  const preorderTraversalWithSteps = (node: TreeNode | null, steps: { node: TreeNode; description: string }[] = []): number[] => {
    const result: number[] = [];
    
    const traverse = (currentNode: TreeNode | null) => {
      if (currentNode) {
        steps.push({ 
          node: { ...currentNode }, 
          description: `Visiting node ${currentNode.value} (Preorder: Root → Left → Right)` 
        });
        result.push(currentNode.value);
        
        if (currentNode.left) traverse(currentNode.left);
        if (currentNode.right) traverse(currentNode.right);
      }
    };
    
    traverse(node);
    return result;
  };

  const postorderTraversalWithSteps = (node: TreeNode | null, steps: { node: TreeNode; description: string }[] = []): number[] => {
    const result: number[] = [];
    
    const traverse = (currentNode: TreeNode | null) => {
      if (currentNode) {
        if (currentNode.left) traverse(currentNode.left);
        if (currentNode.right) traverse(currentNode.right);
        
        steps.push({ 
          node: { ...currentNode }, 
          description: `Visiting node ${currentNode.value} (Postorder: Left → Right → Root)` 
        });
        result.push(currentNode.value);
      }
    };
    
    traverse(node);
    return result;
  };

  // Handle traversal with animation steps
  const handleTraversal = () => {
    if (!root) {
      setError('Tree is empty');
      return;
    }

    resetError();
    const steps: { node: TreeNode; description: string }[] = [];
    let result: number[] = [];
    
    switch (traversalType) {
      case 'inorder':
        result = inorderTraversalWithSteps(root, steps);
        break;
      case 'preorder':
        result = preorderTraversalWithSteps(root, steps);
        break;
      case 'postorder':
        result = postorderTraversalWithSteps(root, steps);
        break;
    }
    
    setTraversalResult(result);
    setAnimationSteps(steps);
    setCurrentStep(0);
    setHighlightedNodes(new Set());
    setCurrentDescription('');
    setIsAnimating(true);
    setIsPaused(false);
  };

  // Calculate node positions for rendering
  const calculatePositions = (node: TreeNode | null, x = 300, y = 50, level = 0): void => {
    if (!node) return;
    
    const horizontalSpacing = Math.max(60, 150 / (level + 1));
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
      calculatePositions(node.left, x - horizontalSpacing, y + 80, level + 1);
    }
    if (node.right) {
      calculatePositions(node.right, x + horizontalSpacing, y + 80, level + 1);
    }
  };

  // Enhanced render tree with highlighting
  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node) return null;
    
    calculatePositions(root);
    
    const renderNode = (currentNode: TreeNode | null): JSX.Element | null => {
      if (!currentNode || currentNode.x === undefined || currentNode.y === undefined) return null;
      
      const isHighlighted = highlightedNodes.has(currentNode.value);
      const nodeColor = isHighlighted ? 'fill-yellow-400' : 
                       currentNode.status === 'visiting' ? 'fill-blue-500' : 
                       currentNode.status === 'found' ? 'fill-green-500' :
                       currentNode.status === 'visited' ? 'fill-blue-300' : 'fill-primary';
      
      return (
        <g key={`node-${currentNode.value}-${currentNode.x}-${currentNode.y}`}>
          {/* Lines to children */}
          {currentNode.left && (
            <line
              x1={currentNode.x}
              y1={currentNode.y + 15}
              x2={currentNode.left.x}
              y2={currentNode.left.y - 15}
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
            />
          )}
          {currentNode.right && (
            <line
              x1={currentNode.x}
              y1={currentNode.y + 15}
              x2={currentNode.right.x}
              y2={currentNode.right.y - 15}
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
            />
          )}
          
          {/* Enhanced node circle with highlighting */}
          <motion.circle
            cx={currentNode.x}
            cy={currentNode.y}
            r="15"
            className={`${nodeColor} stroke-foreground stroke-2`}
            animate={{ 
              scale: isHighlighted ? 1.3 : currentNode.status === 'visiting' ? 1.2 : 1,
              opacity: currentNode.status === 'visited' ? 0.7 : 1
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Node value */}
          <text
            x={currentNode.x}
            y={currentNode.y + 5}
            textAnchor="middle"
            className="text-sm font-bold fill-primary-foreground"
          >
            {currentNode.value}
          </text>
          
          {/* Render children */}
          {renderNode(currentNode.left)}
          {renderNode(currentNode.right)}
        </g>
      );
    };
    
    return renderNode(node);
  };

  // Animation controls
  const playAnimation = () => {
    if (animationSteps.length === 0) {
      setError('No animation to play. Try searching or traversing first.');
      return;
    }
    setIsAnimating(true);
    setIsPaused(false);
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  // Enhanced animation effect with highlighting
  useEffect(() => {
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length) {
        const step = animationSteps[currentStep];
        setHighlightedNodes(new Set([step.node.value]));
        setCurrentDescription(step.description);
        
        animationRef.current = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1500);
      } else {
        setIsAnimating(false);
        setHighlightedNodes(new Set());
        setCurrentDescription('Traversal completed!');
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, isPaused, currentStep, animationSteps]);

  const resetAll = () => {
    setRoot(null);
    setNodeValue('');
    setSearchValue('');
    setDeleteValue('');
    setAnimationSteps([]);
    setCurrentStep(0);
    setTraversalResult([]);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tree Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tree Type Selection */}
          <div className="flex gap-4 items-center justify-center">
            <label className="text-sm font-medium">Tree Type:</label>
            <Select value={treeType} onValueChange={(value: 'binary' | 'bst') => setTreeType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bst">Binary Search Tree</SelectItem>
                <SelectItem value="binary">Binary Tree</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Example Generation */}
          <div className="flex gap-2 justify-center">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={eraseExample} variant="outline" size="sm">
              Erase Example
            </Button>
          </div>

          {/* Animation Controls */}
          {animationSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={playAnimation} 
                disabled={isAnimating}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button 
                onClick={pauseAnimation} 
                disabled={!isAnimating}
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stepForward} size="sm">
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {animationSteps.length}
              </span>
            </div>
          )}

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Node</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={nodeValue}
                  onChange={(e) => setNodeValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" onClick={handleInsert} disabled={isAnimating || !nodeValue.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Node</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isAnimating || !deleteValue.trim()}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Node</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" variant="outline" onClick={handleSearch} disabled={isAnimating || !searchValue.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Traversal</label>
              <div className="flex gap-2">
                <Select value={traversalType} onValueChange={(value: 'inorder' | 'preorder' | 'postorder') => setTraversalType(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inorder">Inorder</SelectItem>
                    <SelectItem value="preorder">Preorder</SelectItem>
                    <SelectItem value="postorder">Postorder</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleTraversal} disabled={isAnimating || !root}>
                  Go
                </Button>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Exploring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Found</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>{traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal:</strong> {traversalResult.join(' → ')}
            </div>
          )}

          {/* Tree Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
            {!root ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Tree</p>
                <p className="text-sm">Generate an example or insert nodes</p>
              </div>
            ) : (
              <svg width="600" height="350" className="overflow-visible">
                {renderTree(root)}
              </svg>
            )}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button onClick={resetAll} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Search (BST):</span>
                <span className="font-mono">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Insert (BST):</span>
                <span className="font-mono">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Delete (BST):</span>
                <span className="font-mono">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Traversal:</span>
                <span className="font-mono">O(n)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• File systems (directory structure)</li>
              <li>• Database indexing</li>
              <li>• Expression parsing</li>
              <li>• Decision trees in AI</li>
              <li>• Huffman coding</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.geeksforgeeks.org/binary-tree-data-structure/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GeeksforGeeks
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreeVisualizer;
