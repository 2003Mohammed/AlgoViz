import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
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
  const [searchValue, setSearchValue] = useState('');
  const [treeType, setTreeType] = useState<'binary' | 'bst'>('bst');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculatePositions = (node: TreeNode | null, x = 400, y = 60, level = 0, minX = 50, maxX = 750): void => {
    if (!node) return;
    
    const availableWidth = maxX - minX;
    const horizontalSpacing = Math.max(60, Math.min(120, availableWidth / Math.pow(2, level + 1)));
    
    node.x = Math.max(minX + 30, Math.min(maxX - 30, x));
    node.y = y;
    
    if (node.left) {
      calculatePositions(node.left, node.x - horizontalSpacing, y + 80, level + 1, minX, node.x - 30);
    }
    if (node.right) {
      calculatePositions(node.right, node.x + horizontalSpacing, y + 80, level + 1, node.x + 30, maxX);
    }
  };

  const getTreeBounds = (node: TreeNode | null): {minX: number, maxX: number, maxY: number} => {
    if (!node) return {minX: 0, maxX: 0, maxY: 0};
    
    let minX = node.x || 0;
    let maxX = node.x || 0;
    let maxY = node.y || 0;
    
    const traverse = (n: TreeNode | null) => {
      if (!n) return;
      minX = Math.min(minX, n.x || 0);
      maxX = Math.max(maxX, n.x || 0);
      maxY = Math.max(maxY, n.y || 0);
      traverse(n.left);
      traverse(n.right);
    };
    
    traverse(node);
    return {minX, maxX, maxY};
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

  const deleteNode = (value: number) => {
    if (!root) return;
    
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
    
    const newRoot = deleteFromBST(root, value);
    if (newRoot) {
      calculatePositions(newRoot);
    }
    setRoot(newRoot);
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

  const performTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!root) return;
    
    const steps: TraversalStep[] = [];
    
    const inorder = (node: TreeNode | null): void => {
      if (!node) return;
      inorder(node.left);
      steps.push({
        node: { ...node, status: 'visiting' },
        description: `Visiting node ${node.value} (Inorder: Left, Root, Right)`
      });
      inorder(node.right);
    };
    
    const preorder = (node: TreeNode | null): void => {
      if (!node) return;
      steps.push({
        node: { ...node, status: 'visiting' },
        description: `Visiting node ${node.value} (Preorder: Root, Left, Right)`
      });
      preorder(node.left);
      preorder(node.right);
    };
    
    const postorder = (node: TreeNode | null): void => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      steps.push({
        node: { ...node, status: 'visiting' },
        description: `Visiting node ${node.value} (Postorder: Left, Right, Root)`
      });
    };
    
    switch (type) {
      case 'inorder':
        inorder(root);
        break;
      case 'preorder':
        preorder(root);
        break;
      case 'postorder':
        postorder(root);
        break;
    }
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const generateExample = () => {
    setRoot(null);
    const baseValue = Math.floor(Math.random() * 20) + 10;
    const values = treeType === 'bst' 
      ? [baseValue, baseValue - 8, baseValue + 12, baseValue - 15, baseValue - 3, baseValue + 6, baseValue + 18] 
      : Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 1);
    
    setTimeout(() => {
      values.forEach(value => insertNode(value));
    }, 100);
  };

  const eraseTree = () => {
    setRoot(null);
    setTraversalSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      insertNode(value);
      setInputValue('');
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
        }, 1500);
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
          r="20"
          className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
          animate={{ scale: node.status === 'visiting' ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <text
          x={node.x}
          y={node.y + 5}
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

  const bounds = root ? getTreeBounds(root) : {minX: 0, maxX: 800, maxY: 300};
  const svgWidth = Math.max(800, bounds.maxX - bounds.minX + 100);
  const svgHeight = Math.max(300, bounds.maxY + 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tree Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-center justify-center flex-wrap">
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
            
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            
            <Button onClick={eraseTree} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Erase Tree
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Insert value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                className="flex-1"
              />
              <Button onClick={handleInsert} size="sm">Insert</Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} size="sm">Search</Button>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={() => performTraversal('inorder')} variant="outline" size="sm">
              Inorder
            </Button>
            <Button onClick={() => performTraversal('preorder')} variant="outline" size="sm">
              Preorder
            </Button>
            <Button onClick={() => performTraversal('postorder')} variant="outline" size="sm">
              Postorder
            </Button>
          </div>

          {traversalSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
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
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {traversalSteps.length}
              </span>
            </div>
          )}

          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
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

          <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] flex items-center justify-center overflow-auto">
            {root ? (
              <div className="w-full flex justify-center">
                <svg 
                  width={Math.min(svgWidth, 800)} 
                  height={Math.min(svgHeight, 500)} 
                  className="overflow-visible"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
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
    </div>
  );
};

export default TreeVisualizer;
