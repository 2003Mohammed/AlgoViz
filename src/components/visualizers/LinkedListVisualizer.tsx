
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Minus, Search, RotateCcw, ExternalLink, AlertTriangle, Shuffle, Eye, ArrowRight, ArrowLeft, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ListNode {
  id: string;
  value: number;
  next?: string | null;
  prev?: string | null;
  status: 'default' | 'inserting' | 'deleting' | 'searching' | 'found' | 'current';
}

type ListType = 'singly' | 'doubly' | 'circular';

const LinkedListVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [head, setHead] = useState<string | null>(null);
  const [tail, setTail] = useState<string | null>(null);
  const [listType, setListType] = useState<ListType>('singly');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState([0.5]); // Default: 0.5 seconds
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSize = 8;

  const resetError = () => {
    setError('');
  };

  const generateExample = () => {
    const examples = [
      [10, 20, 30, 40],
      [5, 15, 25, 35],
      [100, 200, 300, 400]
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];

    const timestamp = Date.now();
    const newNodes: ListNode[] = randomExample.map((value, index) => ({
      id: `node-${timestamp}-${index}`,
      value,
      status: 'default',
      next: null,
      prev: null
    }));

    // Wire next pointers for all types
    for (let i = 0; i < newNodes.length; i++) {
      const isLast = i === newNodes.length - 1;
      newNodes[i].next = isLast ? (listType === 'circular' ? newNodes[0].id : null) : newNodes[i + 1].id;
      if (listType === 'doubly') {
        newNodes[i].prev = i === 0 ? null : newNodes[i - 1].id;
      }
    }

    setNodes(newNodes);
    setHead(newNodes[0]?.id ?? null);
    setTail(newNodes[newNodes.length - 1]?.id ?? null);
    setLastOperation(`Generated example ${listType} linked list`);
    resetError();
  };

  const eraseExample = () => {
    setNodes([]);
    setHead(null);
    setTail(null);
    setLastOperation('Erased linked list');
    resetError();
  };

  const insertAtHead = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (nodes.length >= maxSize) {
      setError('List size limit reached');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const newNodeId = `node-${Date.now()}`;
    const newNode: ListNode = {
      id: newNodeId,
      value,
      status: 'inserting',
      next: head
    };

    if (listType === 'doubly' && head) {
      // Update old head's prev pointer
      setNodes(prev => prev.map(node => 
        node.id === head ? { ...node, prev: newNodeId } : node
      ));
    }

    if (listType === 'circular' && tail) {
      // Update tail's next to point to new head
      setNodes(prev => prev.map(node => 
        node.id === tail ? { ...node, next: newNodeId } : node
      ));
    }

    if (listType === 'doubly' && tail) {
      newNode.prev = tail;
    }

    setNodes(prev => [newNode, ...prev]);
    setHead(newNodeId);
    if (nodes.length === 0) {
      setTail(newNodeId);
    }
    setInputValue('');
    setLastOperation(`Inserted ${value} at head`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const insertAtTail = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (nodes.length >= maxSize) {
      setError('List size limit reached');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const newNodeId = `node-${Date.now()}`;
    const newNode: ListNode = {
      id: newNodeId,
      value,
      status: 'inserting'
    };

    if (listType === 'doubly') newNode.prev = tail;
    if (listType === 'circular') newNode.next = head;

    if (tail) {
      setNodes(prev => prev.map(node => 
        node.id === tail ? { ...node, next: newNodeId } : node
      ));
    }

    setNodes(prev => [...prev, newNode]);
    setTail(newNodeId);
    if (nodes.length === 0) {
      setHead(newNodeId);
    }
    setInputValue('');
    setLastOperation(`Inserted ${value} at tail`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const deleteAtHead = () => {
    if (nodes.length === 0) {
      setError('List is empty');
      return;
    }

    resetError();
    setIsAnimating(true);

    const headNode = nodes.find(node => node.id === head);
    if (!headNode) return;

    // Mark head as deleting
    setNodes(prev => prev.map(node => 
      node.id === head ? { ...node, status: 'deleting' } : node
    ));

    setLastOperation(`Deleted ${headNode.value} from head`);

    // Remove after animation
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.filter(node => node.id !== head));
      
      if (headNode.next && (listType !== 'circular' || headNode.next !== head)) {
        setHead(headNode.next);
        if (listType === 'doubly') {
          setNodes(prev => prev.map(node => 
            node.id === headNode.next ? { ...node, prev: null } : node
          ));
        }
      } else {
        setHead(null);
        setTail(null);
      }
      
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const search = () => {
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
      setLastOperation(`Found ${value} in the list`);
    } else {
      setLastOperation(`${value} not found in the list`);
      setError(`Value ${value} not found`);
    }

    // Reset highlight
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
      setIsAnimating(false);
    }, 1000);
  };

  const reverse = () => {
    if (nodes.length <= 1) {
      setError('Need at least 2 nodes to reverse');
      return;
    }

    resetError();
    setIsAnimating(true);

    // Reverse the pointers
    const reversedNodes = [...nodes].reverse().map((node, index) => {
      const newNode = { ...node };
      
      if (listType === 'singly') {
        if (index < nodes.length - 1) {
          newNode.next = nodes[nodes.length - 2 - index].id;
        } else {
          newNode.next = null;
        }
      } else if (listType === 'doubly') {
        const temp = newNode.next;
        newNode.next = newNode.prev;
        newNode.prev = temp;
      }
      
      return newNode;
    });

    setNodes(reversedNodes);
    const oldHead = head;
    const oldTail = tail;
    setHead(oldTail);
    setTail(oldHead);
    setLastOperation('Reversed the linked list');
    setIsAnimating(false);
  };

  const reset = () => {
    setNodes([]);
    setHead(null);
    setTail(null);
    setInputValue('');
    setSearchValue('');
    setInsertIndex('');
    setDeleteIndex('');
    setLastOperation('List reset');
    setIsAnimating(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !isAnimating) {
      action();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const getNodeColor = (status: ListNode['status']) => {
    switch (status) {
      case 'inserting': return 'bg-green-500';
      case 'deleting': return 'bg-red-500';
      case 'searching': return 'bg-yellow-500';
      case 'found': return 'bg-purple-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  };

  const renderPointer = (fromNode: ListNode, toNodeId: string | null, isNext: boolean = true) => {
    if (!toNodeId) return null;
    
    const direction = isNext ? 'right' : 'left';
    const Icon = isNext ? ArrowRight : ArrowLeft;
    
    return (
      <div className="flex items-center mx-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {listType === 'doubly' && !isNext && (
          <Icon className="h-4 w-4 text-muted-foreground ml-1" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linked List Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* List Type Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">List Type:</label>
            <Select value={listType} onValueChange={(value: ListType) => setListType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singly">Singly Linked</SelectItem>
                <SelectItem value="doubly">Doubly Linked</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
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

          {/* Speed Controller */}
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Animation Speed</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={2}
                min={0.1}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[60px]">
                {animationSpeed[0]}s
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast</span>
              <span>Medium</span>
              <span>Slow</span>
            </div>
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
                  onKeyPress={(e) => handleKeyPress(e, insertAtHead)}
                  disabled={isAnimating}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={insertAtHead} disabled={isAnimating || !inputValue.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Head
                </Button>
                <Button size="sm" onClick={insertAtTail} disabled={isAnimating || !inputValue.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tail
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Node</label>
              <Button size="sm" variant="destructive" onClick={deleteAtHead} disabled={isAnimating || nodes.length === 0}>
                <Minus className="h-4 w-4 mr-2" />
                Delete Head
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Node</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, search)}
                  disabled={isAnimating}
                />
                <Button size="sm" onClick={search} disabled={isAnimating || !searchValue.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Operations</label>
              <Button size="sm" variant="outline" onClick={reverse} disabled={isAnimating || nodes.length < 2}>
                <Eye className="h-4 w-4 mr-2" />
                Reverse
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* List Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] overflow-x-auto">
            {nodes.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Linked List</p>
                <p className="text-sm">Insert nodes to see visualization</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-4">
                <div className="text-xs text-muted-foreground whitespace-nowrap">HEAD →</div>
                <AnimatePresence>
                  {nodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      <div className={`w-16 h-16 ${getNodeColor(node.status)} text-white border border-gray-300 flex items-center justify-center font-bold text-sm rounded-md transition-all duration-300`}>
                        {node.value}
                      </div>
                      
                      {/* Next pointer */}
                      {node.next && renderPointer(node, node.next, true)}
                      {/* Prev pointer for doubly lists */}
                      {listType === 'doubly' && node.prev && renderPointer(node, node.prev, false)}
                      
                      {/* Show circular connection */}
                      {listType === 'circular' && index === nodes.length - 1 && (
                        <div className="flex items-center mx-2">
                          <div className="text-xs text-muted-foreground">→ HEAD</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="text-xs text-muted-foreground whitespace-nowrap">→ NULL</div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Size</div>
              <div className="text-lg font-bold">{nodes.length}/{maxSize}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Type</div>
              <div className="text-lg font-bold capitalize">{listType}</div>
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
                <h4 className="font-semibold mb-2">Linked Lists are used in:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Music player playlists (next/previous song)</li>
                  <li>• Browser history navigation</li>
                  <li>• Undo/Redo functionality in editors</li>
                  <li>• Implementation of other data structures</li>
                  <li>• Memory management in operating systems</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.w3schools.com/dsa/dsa_theory_linkedlist.php" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    W3Schools
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/linked-list-data-structure/" target="_blank" rel="noopener noreferrer">
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
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Insert (Head/Tail):</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Delete (Head):</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Search:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Access:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advantages:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dynamic size allocation</li>
                  <li>• Efficient insertion/deletion</li>
                  <li>• Memory efficient</li>
                  <li>• No memory waste</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
