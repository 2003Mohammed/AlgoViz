
import React, { useState, useRef, useEffect } from 'react';
import { LearnMoreLink } from '../LearnMoreLink';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Minus, ExternalLink, Gauge } from 'lucide-react';
import { Slider } from '../ui/slider';
import { motion } from 'framer-motion';

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  status?: 'default' | 'visiting' | 'visited' | 'found';
}

interface TraversalStep {
  node: TreeNode;
  description: string;
}

const TreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [treeType, setTreeType] = useState<'binary' | 'bst'>('bst');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState([1.2]);

  const calculatePositions = (node: TreeNode | null, x = 300, y = 60, level = 0, minX = 50, maxX = 550): void => {
    if (!node) return;
    
    const availableWidth = maxX - minX;
    const horizontalSpacing = Math.max(40, Math.min(80, availableWidth / Math.pow(2, level + 1)));
    
    node.x = Math.max(minX + 25, Math.min(maxX - 25, x));
    node.y = y;
    
    if (node.left) {
      calculatePositions(node.left, node.x - horizontalSpacing, y + 70, level + 1, minX, node.x - 25);
    }
    if (node.right) {
      calculatePositions(node.right, node.x + horizontalSpacing, y + 70, level + 1, node.x + 25, maxX);
    }
  };

  const insertNode = (value: number) => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      status: 'default'
    };

    if (!root) {
      setRoot(newNode);
      setTimeout(() => {
        calculatePositions(newNode);
        setRoot({...newNode});
      }, 10);
      return;
    }

    if (treeType === 'bst') {
      insertBST(root, newNode);
    } else {
      insertBinary(root, newNode);
    }
    
    const updatedRoot = { ...root };
    calculatePositions(updatedRoot);
    setRoot(updatedRoot);
  };

  const insertBST = (currentNode: TreeNode, newNode: TreeNode): void => {
    if (newNode.value < currentNode.value) {
      if (!currentNode.left) {
        currentNode.left = newNode;
      } else {
        insertBST(currentNode.left, newNode);
      }
    } else {
      if (!currentNode.right) {
        currentNode.right = newNode;
      } else {
        insertBST(currentNode.right, newNode);
      }
    }
  };

  const insertBinary = (currentNode: TreeNode, newNode: TreeNode): void => {
    if (!currentNode.left) {
      currentNode.left = newNode;
    } else if (!currentNode.right) {
      currentNode.right = newNode;
    } else {
      insertBinary(currentNode.left, newNode);
    }
  };

  const deleteNode = (value?: number) => {
    if (!root) return;
    
    let valueToDelete: number;
    
    if (value !== undefined) {
      valueToDelete = value;
    } else if (deleteValue.trim()) {
      valueToDelete = parseInt(deleteValue);
      if (isNaN(valueToDelete)) return;
    } else {
      // Find and delete the rightmost (largest) node
      const findMax = (node: TreeNode | null): number => {
        if (!node) return 0;
        while (node.right) {
          node = node.right;
        }
        return node.value;
      };
      valueToDelete = findMax(root);
    }
    
    const deleteFromBST = (node: TreeNode | null, val: number): TreeNode | null => {
      if (!node) return null;
      
      if (val < node.value) {
        node.left = deleteFromBST(node.left, val);
      } else if (val > node.value) {
        node.right = deleteFromBST(node.right, val);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        
        const minNode = findMin(node.right);
        node.value = minNode.value;
        node.right = deleteFromBST(node.right, minNode.value);
      }
      return node;
    };
    
    const newRoot = deleteFromBST(root, valueToDelete);
    if (newRoot) {
      calculatePositions(newRoot);
    }
    setRoot(newRoot);
    setDeleteValue('');
  };

  const findMin = (node: TreeNode): TreeNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  const searchNode = (value: number) => {
    if (!root) return;
    
    const steps: TraversalStep[] = [];
    
    const search = (node: TreeNode | null): boolean => {
      if (!node) return false;
      
      steps.push({
        node: { ...node },
        description: `Checking node with value ${node.value}`
      });
      
      if (node.value === value) {
        steps.push({
          node: { ...node, status: 'found' },
          description: `Found target value ${value}!`
        });
        return true;
      }
      
      if (treeType === 'bst') {
        if (value < node.value) {
          steps.push({
            node: { ...node },
            description: `${value} < ${node.value}, searching left subtree`
          });
          return search(node.left);
        } else {
          steps.push({
            node: { ...node },
            description: `${value} > ${node.value}, searching right subtree`
          });
          return search(node.right);
        }
      } else {
        return search(node.left) || search(node.right);
      }
    };
    
    const found = search(root);
    if (!found) {
      steps.push({
        node: root,
        description: `Value ${value} not found in tree`
      });
    }
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // 🔥 STRICT: Play traversal with automatic animation and result display
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isTraversalComplete, setIsTraversalComplete] = useState(false);

  const playTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    // 🚨 STRICT VALIDATION: Block invalid trees
    if (!root) {
      console.warn("No tree to traverse");
      return;
    }
    
    const nodeCount = countTreeNodes(root);
    if (nodeCount < 3) {
      console.warn("Tree must have at least 3 nodes for traversal");
      return;
    }
    
    // Reset state
    resetAnimation();
    setTraversalResult([]);
    setIsTraversalComplete(false);
    
    const traversalPath: number[] = [];
    const steps: TraversalStep[] = [];
    
    // 🔥 STRICT: Async traversal with proper highlighting
    const visitNode = async (node: TreeNode): Promise<void> => {
      // Highlight current node
      const updatedRoot = highlightNodeInTree(root, node.id, 'visiting');
      if (updatedRoot) setRoot(updatedRoot);
      
      // Add to result path
      traversalPath.push(node.value);
      
      // Add step for animation
      steps.push({
        node: { ...node, status: 'visiting' },
        description: `Visiting node ${node.value} (${type.charAt(0).toUpperCase() + type.slice(1)})`
      });
      
      // Delay per node based on speed control
      await new Promise(resolve => setTimeout(resolve, animationSpeed[0] * 1000));
    };
    
    // 🔥 STRICT: Execute traversal with proper order
    try {
      if (type === 'inorder') {
        await inorderTraversal(root, visitNode);
      } else if (type === 'preorder') {
        await preorderTraversal(root, visitNode);
      } else {
        await postorderTraversal(root, visitNode);
      }
      
      // 🔥 STRICT: Show final result
      setTraversalResult(traversalPath);
      setIsTraversalComplete(true);
      setTraversalSteps(steps);
      
      // Reset tree highlighting
      setTimeout(() => {
        resetAnimation();
      }, 1000);
      
    } catch (error) {
      console.error("Traversal failed:", error);
      resetAnimation();
    }
  };

  // Helper functions
  const countTreeNodes = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + countTreeNodes(node.left) + countTreeNodes(node.right);
  };

  const highlightNodeInTree = (node: TreeNode | null, targetId: string, status: 'default' | 'visiting' | 'visited' | 'found'): TreeNode | null => {
    if (!node) return null;
    
    const updatedNode: TreeNode = {
      ...node,
      status: node.id === targetId ? status : 'default',
      left: highlightNodeInTree(node.left, targetId, status),
      right: highlightNodeInTree(node.right, targetId, status)
    };
    
    return updatedNode;
  };

  // Async traversal functions (L→N→R, N→L→R, L→R→N)
  const inorderTraversal = async (node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> => {
    if (!node) return;
    await inorderTraversal(node.left, visit);  // Left
    await visit(node);                         // Node
    await inorderTraversal(node.right, visit); // Right
  };

  const preorderTraversal = async (node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> => {
    if (!node) return;
    await visit(node);                          // Node
    await preorderTraversal(node.left, visit);  // Left
    await preorderTraversal(node.right, visit); // Right
  };

  const postorderTraversal = async (node: TreeNode | null, visit: (node: TreeNode) => Promise<void>): Promise<void> => {
    if (!node) return;
    await postorderTraversal(node.left, visit);  // Left
    await postorderTraversal(node.right, visit); // Right
    await visit(node);                          // Node
  };

  // 🚨 STRICT: Generate balanced binary tree with minimum 3 nodes
  const generateBalancedTree = (values: number[]): TreeNode | null => {
    if (!values || values.length < 3) {
      throw new Error("Cannot generate tree with fewer than 3 nodes.");
    }

    values.sort((a, b) => a - b);
    
    const buildBalanced = (start: number, end: number): TreeNode | null => {
      if (start > end) return null;
      
      const mid = Math.floor((start + end) / 2);
      const node: TreeNode = {
        id: Math.random().toString(36).substr(2, 9),
        value: values[mid],
        status: 'default'
      };
      
      node.left = buildBalanced(start, mid - 1);
      node.right = buildBalanced(mid + 1, end);
      
      return node;
    };

    return buildBalanced(0, values.length - 1);
  };

  const generateExample = () => {
    // 🚨 STRICT VALIDATION: Block invalid generation requests
    if (root && isAnimating) {
      console.warn("Cannot generate new tree while animation is running");
      return;
    }

    resetAnimation();
    setRoot(null);
    
    // 🚨 STRICT: Always generate minimum 3+ nodes with balanced structure
    const exampleTypes = ['family', 'organization', 'filesystem', 'decision'];
    const typeIndex = Math.floor(Math.random() * exampleTypes.length);
    const exampleType = exampleTypes[typeIndex];
    
    let values: number[];
    // Strict minimum: 3-7 nodes (NEVER single node)
    const numNodes = 3 + Math.floor(Math.random() * 5); // 3-7 nodes minimum
    
    // Generate contextual values based on example type
    switch (exampleType) {
      case 'family':
        // Family ages (realistic family tree)
        values = [45, 25, 65, 15, 35, 55, 75, 85, 95].slice(0, numNodes);
        break;
      case 'organization':
        // Employee IDs or levels  
        values = [50, 30, 70, 20, 40, 60, 80, 90, 100].slice(0, numNodes);
        break;
      case 'filesystem':
        // File sizes in MB
        values = [100, 50, 150, 25, 75, 125, 175, 200, 250].slice(0, numNodes);
        break;
      case 'decision':
        // Priority scores
        values = [10, 5, 15, 3, 8, 12, 18, 22, 25].slice(0, numNodes);
        break;
      default:
        values = [20, 10, 30, 5, 15, 25, 35, 40, 45].slice(0, numNodes);
    }
    
    // 🚨 STRICT VALIDATION: Never allow less than 3 nodes
    if (values.length < 3) {
      values = [10, 20, 30]; // Emergency fallback
    }
    
    try {
      // Generate balanced binary tree
      const balancedRoot = generateBalancedTree(values);
      
      if (balancedRoot) {
        setTimeout(() => {
          calculatePositions(balancedRoot);
          setRoot(balancedRoot);
        }, 100);
      } else {
        throw new Error("Failed to generate balanced tree");
      }
    } catch (error) {
      console.error("Tree generation failed:", error);
      // Emergency fallback: generate simple 3-node tree
      const fallbackValues = [20, 10, 30];
      const fallbackRoot = generateBalancedTree(fallbackValues);
      if (fallbackRoot) {
        setTimeout(() => {
          calculatePositions(fallbackRoot);
          setRoot(fallbackRoot);
        }, 100);
      }
    }
  };

  const eraseTree = () => {
    setRoot(null);
    setTraversalSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
  };

  // 🚨 STRICT: Validate insertions to prevent invalid trees
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      console.warn("Invalid input: must be a number");
      return;
    }
    
    // Prevent insertion during animation
    if (isAnimating) {
      console.warn("Cannot insert while animation is running");
      return;
    }
    
    insertNode(value);
    setInputValue('');
  };

  const handleDelete = () => {
    const value = parseInt(deleteValue);
    if (!isNaN(value)) {
      deleteNode(value);
    } else {
      deleteNode(); // Delete last node
    }
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      searchNode(value);
      setSearchValue('');
    }
  };

  const stepForward = () => {
    if (currentStep < traversalSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setCurrentDescription('');
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    const resetNodeStatus = (node: TreeNode | null): void => {
      if (node) {
        node.status = 'default';
        resetNodeStatus(node.left);
        resetNodeStatus(node.right);
      }
    };
    
    if (root) {
      resetNodeStatus(root);
      setRoot({ ...root });
    }
  };

  useEffect(() => {
    if (isAnimating && traversalSteps.length > 0) {
      if (currentStep < traversalSteps.length) {
        const step = traversalSteps[currentStep];
        setCurrentDescription(step.description);
        
        const updateNodeStatus = (node: TreeNode | null, targetId: string): TreeNode | null => {
          if (!node) return null;
          
          const updatedNode = { 
            ...node, 
            status: node.id === targetId ? step.node.status : 'default',
            left: updateNodeStatus(node.left, targetId),
            right: updateNodeStatus(node.right, targetId)
          };
          
          return updatedNode;
        };
        
        if (root) {
          const updatedRoot = updateNodeStatus(root, step.node.id);
          setRoot(updatedRoot);
        }
        
        animationRef.current = setTimeout(() => {
          if (currentStep < traversalSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsAnimating(false);
          }
        }, animationSpeed[0] * 1000);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, traversalSteps, root]);

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node) return null;
    
    const getNodeColor = (status?: string) => {
      switch (status) {
        case 'visiting': return 'fill-yellow-500';
        case 'visited': return 'fill-green-500';
        case 'found': return 'fill-green-500';
        default: return 'fill-blue-500';
      }
    };

    return (
      <g key={node.id}>
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="18"
          className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
          animate={{ scale: node.status === 'visiting' ? 1.3 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <text
          x={node.x}
          y={node.y + 4}
          textAnchor="middle"
          className="text-sm font-bold fill-white"
        >
          {node.value}
        </text>
        
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Tree Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex gap-2 sm:gap-4 items-center justify-center flex-wrap">
            <div className="flex gap-2">
              <Button 
                variant={treeType === 'bst' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTreeType('bst')}
              >
                BST
              </Button>
              <Button 
                variant={treeType === 'binary' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTreeType('binary')}
              >
                Binary Tree
              </Button>
            </div>
            
            <Button 
              onClick={generateExample} 
              variant="outline" 
              size="sm"
              disabled={isAnimating}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Balanced Tree
            </Button>
            
            <Button onClick={eraseTree} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Erase Tree
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Insert value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                className="flex-1 text-sm"
              />
              <Button onClick={handleInsert} size="sm">Insert</Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Delete value (empty = last)"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                className="flex-1 text-sm"
              />
              <Button onClick={handleDelete} size="sm" variant="destructive">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-sm"
              />
              <Button onClick={handleSearch} size="sm">Search</Button>
            </div>
          </div>

          {/* 🔥 STRICT: Play Traversal Buttons */}
          <div className="flex gap-2 sm:gap-4 items-center justify-center flex-wrap">
            <Button 
              onClick={() => playTraversal('inorder')} 
              variant="outline" 
              size="sm"
              disabled={!root || isAnimating || (root && countTreeNodes(root) < 3)}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play Inorder (L→N→R)
            </Button>
            <Button 
              onClick={() => playTraversal('preorder')} 
              variant="outline" 
              size="sm"
              disabled={!root || isAnimating || (root && countTreeNodes(root) < 3)}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play Preorder (N→L→R)
            </Button>
            <Button 
              onClick={() => playTraversal('postorder')} 
              variant="outline" 
              size="sm"
              disabled={!root || isAnimating || (root && countTreeNodes(root) < 3)}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play Postorder (L→R→N)
            </Button>
          </div>

          {/* Speed Controller */}
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Animation Speed</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider value={animationSpeed} onValueChange={setAnimationSpeed} min={0.5} max={3} step={0.1} className="flex-1" />
              <span className="text-sm text-muted-foreground min-w-[60px]">{animationSpeed[0]}s</span>
            </div>
          </div>

          {/* 🔥 STRICT: Traversal Result Display */}
          {isTraversalComplete && traversalResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <h4 className="font-semibold text-lg mb-2 text-primary">Traversal Result:</h4>
              <p className="text-2xl font-mono font-bold tracking-wider">
                {traversalResult.join(' → ')}
              </p>
            </motion.div>
          )}

          {traversalSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-2 sm:p-4 bg-muted/20 rounded-lg flex-wrap">
              <Button 
                onClick={() => setIsAnimating(!isAnimating)} 
                size="sm"
                disabled={currentStep >= traversalSteps.length - 1}
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepForward} size="sm" disabled={currentStep >= traversalSteps.length - 1}>
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Step {currentStep + 1} of {traversalSteps.length}
              </span>
            </div>
          )}

          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>🔵 Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>🟡 Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>🟢 Found</span>
              </div>
            </div>
          </div>

          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          <div className="bg-muted/20 p-4 sm:p-6 rounded-lg min-h-[350px] flex items-center justify-center overflow-auto">
            {root ? (
              <div className="w-full flex justify-center">
                <svg 
                  width="600" 
                  height="400" 
                  className="overflow-visible max-w-full"
                  viewBox="0 0 600 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {renderTree(root)}
                </svg>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Tree</p>
                <p className="text-sm">Generate an example or insert values to start</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Real-world Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• File system organization</li>
              <li>• Database indexing (B-trees)</li>
              <li>• Expression parsing and evaluation</li>
              <li>• Decision tree algorithms</li>
              <li>• Huffman coding compression</li>
              <li>• Game AI decision making</li>
            </ul>
          </CardContent>
        </Card>

        {/* Complexity & Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Complexity & Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Time Complexity:</div>
                  <div className="font-mono">O(log n) - Balanced</div>
                  <div className="font-mono">O(n) - Unbalanced</div>
                </div>
                <div>
                  <div className="font-medium">Space Complexity:</div>
                  <div className="font-mono">O(n)</div>
                  <div className="text-xs text-muted-foreground">For n nodes</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Properties:</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Hierarchical data structure</li>
                  <li>• Each node has at most 2 children</li>
                  <li>• BST maintains sorted order</li>
                  <li>• Efficient search and traversal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learn More */}
        <Card>
          <CardHeader>
            <CardTitle>Learn More</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>
                {/* Centralized W3Schools mapping */}
                <LearnMoreLink algorithmName="Binary Tree" isDataStructure />
              </li>
              <li>
                <a 
                  href="https://www.geeksforgeeks.org/binary-search-tree-data-structure/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  GeeksforGeeks BST
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreeVisualizer;
