import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Search, RotateCcw, ExternalLink, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
  prev: string | null;
  status: 'default' | 'searching' | 'adding' | 'removing';
}

interface LinkedList {
  head: string | null;
  tail: string | null;
  nodes: LinkedListNode[];
}

const LinkedListVisualizer: React.FC = () => {
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly');
  const [list, setList] = useState<LinkedList>({ head: null, tail: null, nodes: [] });
  const [inputValue, setInputValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string>('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => {
    setError('');
  };

  const insertAtEnd = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    resetError();
    setIsAnimating(true);

    const newNode: LinkedListNode = {
      id: Date.now().toString(),
      value,
      next: null,
      prev: list.tail,
      status: 'adding'
    };

    setList(prev => {
      const updatedNodes = [...prev.nodes, newNode];
      let updatedHead = prev.head;
      let updatedTail = newNode.id;

      if (!prev.head) {
        updatedHead = newNode.id;
      } else {
        const prevTailNode = updatedNodes.find(node => node.id === prev.tail);
        if (prevTailNode) {
          prevTailNode.next = newNode.id;
        }
      }

      return {
        ...prev,
        head: updatedHead,
        tail: updatedTail,
        nodes: updatedNodes
      };
    });

    setInputValue('');
    setLastOperation(`Inserted ${value} at end`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setList(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({ ...node, status: 'default' }))
      }));
      setIsAnimating(false);
    }, 500);
  };

  const deleteNode = () => {
    const valueToDelete = parseInt(deleteValue.trim());
    if (isNaN(valueToDelete)) {
      setError('Please enter a valid number to delete');
      return;
    }

    resetError();
    setIsAnimating(true);

    let nodeToDeleteId: string | null = null;
    for (const node of list.nodes) {
      if (node.value === valueToDelete) {
        nodeToDeleteId = node.id;
        break;
      }
    }

    if (!nodeToDeleteId) {
      setError(`Node with value ${valueToDelete} not found`);
      setIsAnimating(false);
      return;
    }

    setList(prev => {
      let updatedHead = prev.head;
      let updatedTail = prev.tail;
      let prevNodeId: string | null = null;
      let nextNodeId: string | null = null;

      const updatedNodes = prev.nodes.filter(node => {
        if (node.id === nodeToDeleteId) {
          prevNodeId = node.prev;
          nextNodeId = node.next;
          return false;
        }
        return true;
      }).map(node => ({ ...node }));

      if (prev.head === nodeToDeleteId) {
        updatedHead = nextNodeId;
      }
      if (prev.tail === nodeToDeleteId) {
        updatedTail = prevNodeId;
      }

      if (prevNodeId) {
        const prevNode = updatedNodes.find(node => node.id === prevNodeId);
        if (prevNode) {
          prevNode.next = nextNodeId;
        }
      }
      if (nextNodeId) {
        const nextNode = updatedNodes.find(node => node.id === nextNodeId);
        if (nextNode) {
          nextNode.prev = prevNodeId;
        }
      }

      return {
        ...prev,
        head: updatedHead,
        tail: updatedTail,
        nodes: updatedNodes
      };
    });

    setDeleteValue('');
    setLastOperation(`Deleted node with value ${valueToDelete}`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setList(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({ ...node, status: 'default' }))
      }));
      setIsAnimating(false);
    }, 500);
  };

  const search = () => {
    setIsAnimating(true);
    resetError();

    if (list.nodes.length === 0) {
      setError('List is empty! Nothing to search');
      setIsAnimating(false);
      return;
    }

    setList(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({ ...node, status: 'searching' }))
    }));

    setLastOperation('Searching list');

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setList(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({ ...node, status: 'default' }))
      }));
      setIsAnimating(false);
    }, 1000);
  };

  const reverse = () => {
    setIsAnimating(true);
    resetError();

    if (list.nodes.length < 2) {
      setError('Cannot reverse a list with fewer than 2 nodes');
      setIsAnimating(false);
      return;
    }

    setList(prev => {
      const reversedNodes = [...prev.nodes].reverse().map((node, index, array) => {
        const prevNode = array[index - 1] ? array[index - 1].id : null;
        const nextNode = array[index + 1] ? array[index + 1].id : null;
        return { ...node, next: nextNode, prev: prevNode };
      });

      const updatedHead = reversedNodes[0].id;
      const updatedTail = reversedNodes[reversedNodes.length - 1].id;

      return {
        ...prev,
        head: updatedHead,
        tail: updatedTail,
        nodes: reversedNodes
      };
    });

    setLastOperation('Reversed list');

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setList(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({ ...node, status: 'default' }))
      }));
      setIsAnimating(false);
    }, 1000);
  };

  const reset = () => {
    setList({ head: null, tail: null, nodes: [] });
    setInputValue('');
    setDeleteValue('');
    setLastOperation('List reset');
    setIsAnimating(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnimating) {
      insertAtEnd();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const getNodeColor = (status: LinkedListNode['status']) => {
    switch (status) {
      case 'searching': return 'bg-yellow-500';
      case 'adding': return 'bg-green-500';
      case 'removing': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const renderNode = (node: LinkedListNode) => {
    const isHead = list.head === node.id;
    const hasNext = node.next !== null;
    const hasPrev = listType === 'doubly' && node.prev !== null;

    return (
      <motion.div
        key={node.id}
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Previous pointer for doubly linked lists */}
        {hasPrev && (
          <div className="flex items-center mr-2">
            <div className="w-6 h-0.5 bg-blue-400"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        )}

        {/* Node */}
        <div className={`flex items-center ${isHead ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className={`${getNodeColor(node.status)} text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}>
            {node.value}
          </div>
          
          {/* Next pointer */}
          {hasNext && (
            <div className="flex items-center ml-2">
              <div className="w-6 h-0.5 bg-green-400"></div>
              <div className="w-0 h-0 border-l-4 border-l-green-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderLinkedList = () => {
    const renderedNodes: React.ReactNode[] = [];
    let current = list.head;
    let safetyCount = 0;

    while (current && safetyCount < list.nodes.length) {
      const node = list.nodes.find(n => n.id === current);
      if (node) {
        renderedNodes.push(renderNode(node));
        current = node.next;
      } else {
        break;
      }
      safetyCount++;
    }

    return renderedNodes;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linked List Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* List Type Selector */}
          <div className="flex gap-2 justify-center">
            {(['singly', 'doubly', 'circular'] as const).map((type) => (
              <Button
                key={type}
                variant={listType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setListType(type);
                  reset();
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {/* Operations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Value</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isAnimating}
                />
                <Button size="sm" onClick={insertAtEnd} disabled={isAnimating || !inputValue.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Value</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" variant="destructive" onClick={deleteNode} disabled={isAnimating || !deleteValue.trim()}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Button size="sm" variant="outline" onClick={search} disabled={isAnimating || list.nodes.length === 0}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Operations</label>
              <Button size="sm" variant="outline" onClick={reverse} disabled={isAnimating || list.nodes.length < 2}>
                <RotateCcw className="h-4 w-4 mr-2" />
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
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-center justify-center">
            {list.nodes.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty {listType} Linked List</p>
                <p className="text-sm">Insert nodes to see visualization</p>
              </div>
            ) : (
              <div className="flex items-center space-x-4 overflow-x-auto">
                {list.head !== null && (
                  <div className="text-xs text-yellow-600 mr-2">
                    HEAD →
                  </div>
                )}
                {renderLinkedList()}
                {listType === 'circular' && list.nodes.length > 1 && (
                  <div className="ml-4 text-xs text-muted-foreground">
                    ↻ to head
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-400 mr-1"></div>
              <span>Next</span>
            </div>
            {listType === 'doubly' && (
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-blue-400 mr-1"></div>
                <span>Prev</span>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
              <span>Head</span>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Size</div>
              <div className="text-lg font-bold">{list.nodes.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Type</div>
              <div className="text-sm capitalize">{listType}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
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
                  <li>• Dynamic memory allocation</li>
                  <li>• Implementation of other data structures</li>
                  <li>• Music playlist (next/previous songs)</li>
                  <li>• Undo functionality in software</li>
                  <li>• Browser history navigation</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    MDN
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/data-structures/linked-list/" target="_blank" rel="noopener noreferrer">
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
            <CardTitle>Complexity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Search:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Insert at head:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Insert at tail:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Delete:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advantages:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dynamic size</li>
                  <li>• Efficient insertion/deletion</li>
                  <li>• No memory waste</li>
                  <li>• Easy to implement</li>
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
