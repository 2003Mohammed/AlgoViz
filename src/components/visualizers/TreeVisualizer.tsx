
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Minus, Search, RotateCcw, ExternalLink, AlertTriangle, Shuffle, Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  id: string;
  value: number;
  left?: string | null;
  right?: string | null;
  parent?: string | null;
  status: 'default' | 'inserting' | 'deleting' | 'searching' | 'found' | 'visiting' | 'current';
  x?: number;
  y?: number;
  level?: number;
}

type TreeType = 'binary' | 'bst';
type TraversalType = 'inorder' | 'preorder' | 'postorder';

const TreeVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [root, setRoot] = useState<string | null>(null);
  const [treeType, setTreeType] = useState<TreeType>('bst');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string>('');
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(-1);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const traversalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => {
    setError('');
  };

  const calculatePositions = (nodeId: string | null, x: number, y: number, level: number, spacing: number): void => {
    if (!nodeId) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, x, y, level } : n
    ));

    const nextSpacing = spacing / 2;
    const nextY = y + 80;

    if (node.left) {
      calculatePositions(node.left, x - spacing, nextY, level + 1, nextSpacing);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, nextY, level + 1, nextSpacing);
    }
  };

  const generateExample = () => {
    const examples = {
      binary: [
        { nodes: [10, 5, 15, 3, 7, 12, 18], structure: 'balanced' },
        { nodes: [20, 10, 30, 5, 15, 25, 35], structure: 'balanced' }
      ],
      bst: [
        { nodes: [50, 30, 70, 20, 40, 60, 80], structure: 'balanced' },
        { nodes: [25, 15, 35, 10, 20, 30, 40], structure: 'balanced' }
      ]
    };

    const example = examples[treeType][Math.floor(Math.random() * examples[treeType].length)];
    
    const newNodes: TreeNode[] = [];
    let newRoot: string | null = null;

    // For BST, insert nodes one by one to maintain BST property
    if (treeType === 'bst') {
      example.nodes.forEach((value, index) => {
        const nodeId = `node-${Date.now()}-${index}`;
        const node: TreeNode = {
          id: nodeId,
          value,
          status: 'default'
        };

        if (index === 0) {
          newRoot = nodeId;
          newNodes.push(node);
        } else {
          // Insert into BST
          let current = newNodes.find(n => n.id === newRoot);
          let parent: TreeNode | undefined;
          
          while (current) {
            parent = current;
            if (value < current.value) {
              if (!current.left) {
                current.left = nodeId;
                node.parent = current.id;
                break;
              } else {
                current = newNodes.find(n => n.id === current!.left);
              }
            } else {
              if (!current.right) {
                current.right = nodeId;
                node.parent = current.id;
                break;
              } else {
                current = newNodes.find(n => n.id === current!.right);
              }
            }
          }
          newNodes.push(node);
        }
      });
    } else {
      // For binary tree, create a more structured approach
      example.nodes.forEach((value, index) => {
        const nodeId = `node-${Date.now()}-${index}`;
        const node: TreeNode = {
          id: nodeId,
          value,
          status: 'default'
        };

        if (index === 0) {
          newRoot = nodeId;
        } else {
          const parentIndex = Math.floor((index - 1) / 2);
          const parentId = `node-${Date.now()}-${parentIndex}`;
          
          if (index % 2 === 1) {
            // Left child
            const parent = newNodes.find(n => n.id === parentId);
            if (parent) {
              parent.left = nodeId;
              node.parent = parentId;
            }
          } else {
            // Right child
            const parent = newNodes.find(n => n.id === parentId);
            if (parent) {
              parent.right = nodeId;
              node.parent = parentId;
            }
          }
        }
        
        newNodes.push(node);
      });
    }

    setNodes(newNodes);
    setRoot(newRoot);
    setLastOperation(`Generated example ${treeType} tree`);
    resetError();
    
    // Calculate positions after a short delay
    setTimeout(() => {
      calculatePositions(newRoot, 300, 50, 0, 100);
    }, 100);
  };

  const eraseExample = () => {
    setNodes([]);
    setRoot(null);
    setTraversalResult([]);
    setCurrentTraversalIndex(-1);
    setLastOperation('Erased tree');
    resetError();
  };

  const insertNode = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    // Check if value already exists
    if (nodes.some(node => node.value === value)) {
      setError('Value already exists in the tree');
      return;
    }

    resetError();
    setIsAnimating(true);

    const newNodeId = `node-${Date.now()}`;
    const newNode: TreeNode = {
      id: newNodeId,
      value,
      status: 'inserting'
    };

    if (!root) {
      // First node becomes root
      setNodes([newNode]);
      setRoot(newNodeId);
      setLastOperation(`Inserted ${value} as root`);
    } else {
      // Insert based on tree type
      if (treeType === 'bst') {
        // BST insertion
        let currentId = root;
        let found = false;
        
        while (!found) {
          const current = nodes.find(n => n.id === currentId);
          if (!current) break;
          
          if (value < current.value) {
            if (!current.left) {
              current.left = newNodeId;
              newNode.parent = currentId;
              found = true;
            } else {
              currentId = current.left;
            }
          } else {
            if (!current.right) {
              current.right = newNodeId;
              newNode.parent = currentId;
              found = true;
            } else {
              currentId = current.right;
            }
          }
        }
        
        setNodes(prev => [...prev, newNode]);
        setLastOperation(`Inserted ${value} in BST`);
      } else {
        // Binary tree insertion (level order)
        const queue = [root];
        let inserted = false;
        
        while (queue.length > 0 && !inserted) {
          const currentId = queue.shift()!;
          const current = nodes.find(n => n.id === currentId);
          if (!current) continue;
          
          if (!current.left) {
            current.left = newNodeId;
            newNode.parent = currentId;
            inserted = true;
          } else if (!current.right) {
            current.right = newNodeId;
            newNode.parent = currentId;
            inserted = true;
          } else {
            queue.push(current.left);
            queue.push(current.right);
          }
        }
        
        setNodes(prev => [...prev, newNode]);
        setLastOperation(`Inserted ${value} in binary tree`);
      }
    }

    setInputValue('');

    // Animation cleanup and position recalculation
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      setIsAnimating(false);
      calculatePositions(root, 300, 50, 0, 100);
    }, 500);
  };

  const searchNode = () => {
    const value = parseInt(searchValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number to search');
      return;
    }

    resetError();
    setIsAnimating(true);

    const foundNode = nodes.find(node => node.value === value);
    if (foundNode) {
      setNodes(prev => prev.map(node => 
        node.id === foundNode.id ? { ...node, status: 'found' } : node
      ));
      setLastOperation(`Found ${value} in the tree`);
    } else {
      setLastOperation(`${value} not found in the tree`);
      setError(`Value ${value} not found`);
    }

    // Reset highlight
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      setIsAnimating(false);
    }, 1000);
  };

  const deleteNode = () => {
    const value = parseInt(deleteValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number to delete');
      return;
    }

    const nodeToDelete = nodes.find(node => node.value === value);
    if (!nodeToDelete) {
      setError(`Value ${value} not found in the tree`);
      return;
    }

    resetError();
    setIsAnimating(true);

    // Mark node as deleting
    setNodes(prev => prev.map(node => 
      node.id === nodeToDelete.id ? { ...node, status: 'deleting' } : node
    ));

    setLastOperation(`Deleted ${value} from tree`);
    setDeleteValue('');

    // Simplified deletion - just remove the node
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => {
        const newNodes = prev.filter(node => node.id !== nodeToDelete.id);
        
        // Update parent references
        newNodes.forEach(node => {
          if (node.left === nodeToDelete.id) node.left = null;
          if (node.right === nodeToDelete.id) node.right = null;
        });
        
        return newNodes;
      });
      
      if (root === nodeToDelete.id) {
        setRoot(null);
      }
      
      setIsAnimating(false);
      
      // Recalculate positions
      setTimeout(() => {
        calculatePositions(root, 300, 50, 0, 100);
      }, 100);
    }, 500);
  };

  const performTraversal = (type: TraversalType) => {
    if (!root || nodes.length === 0) {
      setError('Tree is empty');
      return;
    }

    resetError();
    setIsTraversing(true);
    setCurrentTraversalIndex(0);
    setTraversalType(type);

    const result: number[] = [];
    const traverse = (nodeId: string | null) => {
      if (!nodeId) return;
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      if (type === 'preorder') {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      } else if (type === 'inorder') {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      } else if (type === 'postorder') {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };

    traverse(root);
    setTraversalResult(result);
    setLastOperation(`${type} traversal: ${result.join(' → ')}`);

    // Animate traversal
    let index = 0;
    const animateStep = () => {
      if (index < result.length) {
        const value = result[index];
        const node = nodes.find(n => n.value === value);
        if (node) {
          setNodes(prev => prev.map(n => 
            n.id === node.id ? { ...n, status: 'visiting' } : 
            n.status === 'visiting' ? { ...n, status: 'default' } : n
          ));
        }
        setCurrentTraversalIndex(index);
        index++;
        
        if (traversalRef.current) clearTimeout(traversalRef.current);
        traversalRef.current = setTimeout(animateStep, 1000);
      } else {
        setIsTraversing(false);
        setCurrentTraversalIndex(-1);
        setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      }
    };

    animateStep();
  };

  const reset = () => {
    setNodes([]);
    setRoot(null);
    setInputValue('');
    setSearchValue('');
    setDeleteValue('');
    setTraversalResult([]);
    setCurrentTraversalIndex(-1);
    setLastOperation('Tree reset');
    setIsAnimating(false);
    setIsTraversing(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
    if (traversalRef.current) clearTimeout(traversalRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !isAnimating && !isTraversing) {
      action();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (traversalRef.current) clearTimeout(traversalRef.current);
    };
  }, []);

  const getNodeColor = (status: TreeNode['status']) => {
    switch (status) {
      case 'inserting': return 'bg-green-500';
      case 'deleting': return 'bg-red-500';
      case 'searching': return 'bg-yellow-500';
      case 'found': return 'bg-purple-500';
      case 'visiting': return 'bg-blue-500';
      case 'current': return 'bg-orange-500';
      default: return 'bg-primary';
    }
  };

  const renderTree = () => {
    if (nodes.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Tree</p>
          <p className="text-sm">Insert nodes to see visualization</p>
        </div>
      );
    }

    return (
      <svg width="600" height="400" className="mx-auto">
        {/* Render edges */}
        {nodes.map(node => (
          <g key={`edges-${node.id}`}>
            {node.left && (
              <line
                x1={node.x || 0}
                y1={(node.y || 0) + 20}
                x2={nodes.find(n => n.id === node.left)?.x || 0}
                y2={(nodes.find(n => n.id === node.left)?.y || 0) + 20}
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              />
            )}
            {node.right && (
              <line
                x1={node.x || 0}
                y1={(node.y || 0) + 20}
                x2={nodes.find(n => n.id === node.right)?.x || 0}
                y2={(nodes.find(n => n.id === node.right)?.y || 0) + 20}
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              />
            )}
          </g>
        ))}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <motion.circle
              cx={node.x || 0}
              cy={(node.y || 0) + 20}
              r="20"
              className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <text
              x={node.x || 0}
              y={(node.y || 0) + 25}
              textAnchor="middle"
              className="text-sm font-bold fill-primary-foreground"
            >
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tree Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tree Type Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Tree Type:</label>
            <Select value={treeType} onValueChange={(value: TreeType) => setTreeType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="binary">Binary Tree</SelectItem>
                <SelectItem value="bst">Binary Search Tree</SelectItem>
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

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Node</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, insertNode)}
                  disabled={isAnimating || isTraversing}
                />
                <Button size="sm" onClick={insertNode} disabled={isAnimating || isTraversing || !inputValue.trim()}>
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
                  onKeyPress={(e) => handleKeyPress(e, deleteNode)}
                  disabled={isAnimating || isTraversing}
                />
                <Button size="sm" variant="destructive" onClick={deleteNode} disabled={isAnimating || isTraversing || !deleteValue.trim()}>
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
                  onKeyPress={(e) => handleKeyPress(e, searchNode)}
                  disabled={isAnimating || isTraversing}
                />
                <Button size="sm" onClick={searchNode} disabled={isAnimating || isTraversing || !searchValue.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Traversal</label>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => performTraversal('inorder')} disabled={isAnimating || isTraversing || nodes.length === 0}>
                  In
                </Button>
                <Button size="sm" variant="outline" onClick={() => performTraversal('preorder')} disabled={isAnimating || isTraversing || nodes.length === 0}>
                  Pre
                </Button>
                <Button size="sm" variant="outline" onClick={() => performTraversal('postorder')} disabled={isAnimating || isTraversing || nodes.length === 0}>
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <SkipForward className="h-4 w-4" />
              <span className="text-sm">
                <strong>{traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal:</strong> {traversalResult.join(' → ')}
              </span>
            </div>
          )}

          {/* Tree Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
            {renderTree()}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Nodes</div>
              <div className="text-lg font-bold">{nodes.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Type</div>
              <div className="text-lg font-bold">{treeType === 'bst' ? 'BST' : 'Binary'}</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Trees are used in:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• File system hierarchies</li>
                  <li>• Database indexing (B-trees)</li>
                  <li>• Decision making algorithms</li>
                  <li>• HTML DOM structure</li>
                  <li>• Expression parsing</li>
                  <li>• Autocomplete features</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/binary-tree-data-structure/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GeeksforGeeks
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complexity & Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity (BST):</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Search:</span>
                    <span className="font-mono">O(log n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Insert:</span>
                    <span className="font-mono">O(log n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Delete:</span>
                    <span className="font-mono">O(log n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Traversal:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advantages:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hierarchical data representation</li>
                  <li>• Fast search O(log n) when balanced</li>
                  <li>• Efficient insertion and deletion</li>
                  <li>• Natural recursive structure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreeVisualizer;
