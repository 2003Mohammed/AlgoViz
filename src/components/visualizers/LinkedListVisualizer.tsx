import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowRight, Plus, Minus, Search, RotateCcw, Play, Pause, StepForward, StepBack } from 'lucide-react';
import { useAnimationControls } from '../../hooks/useAnimationControls';
import { useVisualizationSteps, VisualizationStep } from '../../hooks/useVisualizationSteps';
import { toast } from '../../hooks/use-toast';

interface ListNode {
  id: string;
  value: number;
  next: string | null;
  prev?: string | null; // For doubly linked list
  status: 'default' | 'active' | 'found' | 'inserting' | 'deleting' | 'traversing';
}

interface LinkedListState {
  nodes: ListNode[];
  head: string | null;
  tail?: string | null; // For doubly linked list
  type: 'singly' | 'doubly' | 'circular';
}

const LinkedListVisualizer: React.FC = () => {
  const [list, setList] = useState<LinkedListState>({
    nodes: [
      { id: '1', value: 10, next: '2', status: 'default' },
      { id: '2', value: 20, next: '3', status: 'default' },
      { id: '3', value: 30, next: null, status: 'default' }
    ],
    head: '1',
    type: 'singly'
  });

  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [operationLogs, setOperationLogs] = useState<string[]>([]);

  const visualization = useVisualizationSteps(list);
  const controls = useAnimationControls(visualization.totalSteps);

  // Animation effect
  useEffect(() => {
    if (controls.isPlaying && controls.currentStep < visualization.totalSteps - 1) {
      const timeout = setTimeout(() => {
        controls.setCurrentStep(controls.currentStep + 1);
      }, 1500 / controls.speed);
      
      controls.animationRef.current = timeout;
      return () => clearTimeout(timeout);
    } else if (controls.currentStep >= visualization.totalSteps - 1) {
      controls.pause();
    }
  }, [controls.isPlaying, controls.currentStep, controls.speed, visualization.totalSteps]);

  // Update list based on current step
  useEffect(() => {
    const currentStep = visualization.getCurrentStep(controls.currentStep);
    if (currentStep) {
      setList(currentStep.data);
    }
  }, [controls.currentStep, visualization]);

  const addLog = useCallback((message: string) => {
    setOperationLogs(prev => [...prev.slice(-4), message]);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const insertAtHead = useCallback(() => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    const newId = generateId();

    // Step 1: Show new node being created
    const newNode: ListNode = { id: newId, value, next: list.head, status: 'inserting' };
    const step1List = {
      ...list,
      nodes: [newNode, ...list.nodes.map(n => ({ ...n, status: 'default' as const }))]
    };
    
    steps.push({
      data: step1List,
      description: `Creating new node with value ${value}`
    });

    // Step 2: Update head pointer
    const step2List = {
      ...step1List,
      head: newId,
      nodes: step1List.nodes.map(n => ({
        ...n,
        status: n.id === newId ? 'active' as const : 'default' as const
      }))
    };
    
    steps.push({
      data: step2List,
      description: `Updated head to point to new node`
    });

    // Step 3: Complete insertion
    const finalList = {
      ...step2List,
      nodes: step2List.nodes.map(n => ({ ...n, status: 'default' as const }))
    };
    
    steps.push({
      data: finalList,
      description: `Node inserted at head successfully`
    });

    steps.forEach(step => visualization.addStep(step));
    setList(finalList);
    setInputValue('');
    controls.reset();
    addLog(`Inserted ${value} at head`);
    toast({ title: 'Node inserted', description: `Added ${value} at head` });
  }, [inputValue, list, visualization, controls, addLog]);

  const insertAtTail = useCallback(() => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    const newId = generateId();

    if (!list.head) {
      // Empty list case
      const newNode: ListNode = { id: newId, value, next: null, status: 'inserting' };
      const newList = { ...list, nodes: [newNode], head: newId };
      
      steps.push({
        data: newList,
        description: `Inserted ${value} as first node`
      });
    } else {
      // Find tail
      let currentId = list.head;
      const traversalSteps: VisualizationStep[] = [];
      
      while (currentId) {
        const node = list.nodes.find(n => n.id === currentId);
        if (!node) break;
        
        traversalSteps.push({
          data: {
            ...list,
            nodes: list.nodes.map(n => ({
              ...n,
              status: n.id === currentId ? 'traversing' as const : 'default' as const
            }))
          },
          description: `Traversing to find tail, currently at ${node.value}`
        });
        
        if (!node.next) break;
        currentId = node.next;
      }
      
      steps.push(...traversalSteps);

      // Create new node
      const newNode: ListNode = { id: newId, value, next: null, status: 'inserting' };
      const updatedNodes = list.nodes.map(n => 
        n.id === currentId ? { ...n, next: newId, status: 'active' as const } : { ...n, status: 'default' as const }
      );
      
      steps.push({
        data: {
          ...list,
          nodes: [...updatedNodes, newNode]
        },
        description: `Linked tail node to new node with value ${value}`
      });
    }

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    setInputValue('');
    addLog(`Inserted ${value} at tail`);
    toast({ title: 'Node inserted', description: `Added ${value} at tail` });
  }, [inputValue, list, visualization, controls, addLog]);

  const insertAtPosition = useCallback(() => {
    const value = parseInt(inputValue);
    const pos = parseInt(position);
    
    if (isNaN(value) || isNaN(pos)) {
      toast({ title: 'Error', description: 'Please enter valid numbers', variant: 'destructive' });
      return;
    }

    if (pos < 0) {
      toast({ title: 'Error', description: 'Position must be non-negative', variant: 'destructive' });
      return;
    }

    if (pos === 0) {
      insertAtHead();
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];

    // Traverse to position
    let currentId = list.head;
    let currentPos = 0;
    
    while (currentId && currentPos < pos - 1) {
      const node = list.nodes.find(n => n.id === currentId);
      if (!node || !node.next) break;
      
      steps.push({
        data: {
          ...list,
          nodes: list.nodes.map(n => ({
            ...n,
            status: n.id === currentId ? 'traversing' as const : 'default' as const
          }))
        },
        description: `Traversing to position ${pos}, currently at position ${currentPos}`
      });
      
      currentId = node.next;
      currentPos++;
    }

    if (currentPos === pos - 1 && currentId) {
      const newId = generateId();
      const currentNode = list.nodes.find(n => n.id === currentId);
      
      if (currentNode) {
        const newNode: ListNode = { 
          id: newId, 
          value, 
          next: currentNode.next, 
          status: 'inserting' 
        };
        
        const updatedNodes = list.nodes.map(n => 
          n.id === currentId ? { ...n, next: newId, status: 'active' as const } : { ...n, status: 'default' as const }
        );
        
        steps.push({
          data: {
            ...list,
            nodes: [...updatedNodes, newNode]
          },
          description: `Inserted ${value} at position ${pos}`
        });
      }
    } else {
      toast({ title: 'Error', description: 'Position out of bounds', variant: 'destructive' });
      return;
    }

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    setInputValue('');
    setPosition('');
    addLog(`Inserted ${value} at position ${pos}`);
    toast({ title: 'Node inserted', description: `Added ${value} at position ${pos}` });
  }, [inputValue, position, list, visualization, controls, addLog, insertAtHead]);

  const deleteAtHead = useCallback(() => {
    if (!list.head) {
      toast({ title: 'Error', description: 'List is empty', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    
    const headNode = list.nodes.find(n => n.id === list.head);
    if (!headNode) return;

    // Step 1: Mark node for deletion
    steps.push({
      data: {
        ...list,
        nodes: list.nodes.map(n => ({
          ...n,
          status: n.id === list.head ? 'deleting' as const : 'default' as const
        }))
      },
      description: `Marking head node (${headNode.value}) for deletion`
    });

    // Step 2: Update head pointer
    const newHead = headNode.next;
    const filteredNodes = list.nodes.filter(n => n.id !== list.head);
    
    steps.push({
      data: {
        ...list,
        head: newHead,
        nodes: filteredNodes.map(n => ({ ...n, status: 'default' as const }))
      },
      description: `Updated head pointer and removed node`
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    addLog(`Deleted ${headNode.value} from head`);
    toast({ title: 'Node deleted', description: `Removed ${headNode.value} from head` });
  }, [list, visualization, controls, addLog]);

  const searchElement = useCallback(() => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    
    let currentId = list.head;
    let position = 0;
    let found = false;

    while (currentId) {
      const node = list.nodes.find(n => n.id === currentId);
      if (!node) break;

      steps.push({
        data: {
          ...list,
          nodes: list.nodes.map(n => ({
            ...n,
            status: n.id === currentId ? 'traversing' as const : 'default' as const
          }))
        },
        description: `Searching at position ${position}, checking value ${node.value}`
      });

      if (node.value === value) {
        steps.push({
          data: {
            ...list,
            nodes: list.nodes.map(n => ({
              ...n,
              status: n.id === currentId ? 'found' as const : 'default' as const
            }))
          },
          description: `Found ${value} at position ${position}!`
        });
        found = true;
        break;
      }

      currentId = node.next;
      position++;
    }

    if (!found) {
      steps.push({
        data: {
          ...list,
          nodes: list.nodes.map(n => ({ ...n, status: 'default' as const }))
        },
        description: `${value} not found in the list`
      });
    }

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    setSearchValue('');
    addLog(`Searched for ${value} - ${found ? 'Found' : 'Not found'}`);
    toast({ title: 'Search completed', description: `${value} ${found ? 'found' : 'not found'}` });
  }, [searchValue, list, visualization, controls, addLog]);

  const reverseList = useCallback(() => {
    if (!list.head) {
      toast({ title: 'Error', description: 'List is empty', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    
    let prev: string | null = null;
    let currentId: string | null = list.head;
    
    const workingNodes = [...list.nodes];
    
    while (currentId) {
      const currentNode = workingNodes.find(n => n.id === currentId);
      if (!currentNode) break;
      
      steps.push({
        data: {
          ...list,
          nodes: workingNodes.map(n => ({
            ...n,
            status: n.id === currentId ? 'active' as const : 'default' as const
          }))
        },
        description: `Reversing link for node ${currentNode.value}`
      });
      
      const nextId = currentNode.next;
      currentNode.next = prev;
      prev = currentId;
      currentId = nextId;
    }
    
    steps.push({
      data: {
        ...list,
        head: prev,
        nodes: workingNodes.map(n => ({ ...n, status: 'default' as const }))
      },
      description: 'List reversed successfully!'
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    addLog('Reversed the linked list');
    toast({ title: 'List reversed', description: 'Linked list has been reversed' });
  }, [list, visualization, controls, addLog]);

  const currentStep = visualization.getCurrentStep(controls.currentStep);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linked List Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* List Type Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">List Type:</label>
            <Select value={list.type} onValueChange={(value: 'singly' | 'doubly' | 'circular') => 
              setList(prev => ({ ...prev, type: value }))
            }>
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

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert at Head</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                />
                <Button onClick={insertAtHead} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert at Tail</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                />
                <Button onClick={insertAtTail} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert at Position</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                  className="flex-1"
                />
                <Input
                  placeholder="Pos"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  type="number"
                  className="w-16"
                />
                <Button onClick={insertAtPosition} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="number"
                />
                <Button onClick={searchElement} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* List Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] overflow-x-auto">
            <div className="flex items-center gap-4 pb-4">
              <span className="text-sm font-medium text-muted-foreground">
                HEAD → {list.head ? list.nodes.find(n => n.id === list.head)?.value : 'NULL'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              <AnimatePresence mode="sync">
                {list.nodes.map((node, index) => {
                  const getColor = () => {
                    switch (node.status) {
                      case 'active': return 'bg-blue-500 border-blue-600';
                      case 'found': return 'bg-green-500 border-green-600';
                      case 'inserting': return 'bg-purple-500 border-purple-600';
                      case 'deleting': return 'bg-red-500 border-red-600';
                      case 'traversing': return 'bg-yellow-500 border-yellow-600';
                      default: return 'bg-primary border-primary/60';
                    }
                  };

                  const isHead = node.id === list.head;
                  
                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        className={`${getColor()} text-white p-4 rounded-lg border-2 relative min-w-[80px] text-center`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: node.status === 'active' || node.status === 'found' ? 1.1 : 1 
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="font-bold text-lg">{node.value}</div>
                        <div className="text-xs opacity-80 mt-1">
                          {isHead && '(HEAD)'}
                        </div>
                        {(node.status === 'traversing' || node.status === 'active') && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-lg"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      
                      {node.next && (
                        <motion.div 
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </motion.div>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
              
              {list.nodes.length === 0 && (
                <div className="text-muted-foreground text-center py-8">
                  Empty List - Add some nodes to get started
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Button onClick={deleteAtHead} variant="destructive" size="sm">
              <Minus className="h-4 w-4 mr-2" />
              Delete Head
            </Button>
            <Button onClick={reverseList} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reverse List
            </Button>
            <Button onClick={controls.stepBackward} variant="outline" size="sm" disabled={controls.currentStep === 0}>
              <StepBack className="h-4 w-4" />
            </Button>
            <Button onClick={controls.isPlaying ? controls.pause : controls.play} variant="outline" size="sm">
              {controls.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={controls.stepForward} variant="outline" size="sm" disabled={controls.currentStep >= visualization.totalSteps - 1}>
              <StepForward className="h-4 w-4" />
            </Button>
            <Button onClick={controls.reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Step Info and Operation Logs */}
          {visualization.totalSteps > 0 && (
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Step {controls.currentStep + 1} of {visualization.totalSteps}
                </span>
              </div>
              {currentStep && (
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
              )}
            </div>
          )}
          
          {operationLogs.length > 0 && (
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Operation Log:</h4>
              <div className="space-y-1">
                {operationLogs.map((log, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Linked Lists are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Undo functionality in applications</li>
                <li>• Music playlists (next/previous songs)</li>
                <li>• Browser history navigation</li>
                <li>• Memory management in operating systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advantages:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dynamic size allocation</li>
                <li>• Efficient insertion/deletion</li>
                <li>• Memory efficient for sparse data</li>
                <li>• No memory waste</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning References */}
      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.w3schools.com/dsa/dsa_data_linkedlists.php" target="_blank" rel="noopener noreferrer">
                W3Schools - Linked Lists
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/LinkedList" target="_blank" rel="noopener noreferrer">
                MDN - Linked Lists
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.geeksforgeeks.org/linked-list-data-structure/" target="_blank" rel="noopener noreferrer">
                GeeksforGeeks - Linked Lists
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedListVisualizer;
