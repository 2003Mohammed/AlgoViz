
import { useState, useEffect } from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { VisualizationStep } from '../../types/visualizer';
import { toast } from '../../hooks/use-toast';

export const useDataStructureState = (dataStructure: DataStructure) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [animationSteps, setAnimationSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
  }, [dataStructure.id]);
  
  const resetToDefault = () => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    toast({
      title: "Reset Complete",
      description: `${dataStructure.name} has been reset to default state`,
    });
  };
  
  const addLogEntry = (message: string) => {
    setOperationLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const createAnimationSteps = (operation: string, oldStructure: any, newStructure: any) => {
    const steps: VisualizationStep[] = [];
    
    // Create animation steps based on the operation
    switch (operation) {
      case 'add':
      case 'push':
      case 'enqueue':
        steps.push({
          array: oldStructure.map((item: any) => ({ 
            value: typeof item === 'object' ? item.value : item, 
            status: 'default' 
          })),
          lineIndex: 0,
          description: `Before ${operation}`
        });
        steps.push({
          array: newStructure.map((item: any, index: number) => ({ 
            value: typeof item === 'object' ? item.value : item, 
            status: index === newStructure.length - 1 ? 'added' : 'default' 
          })),
          lineIndex: 1,
          description: `After ${operation}`
        });
        break;
        
      case 'remove':
      case 'pop':
      case 'dequeue':
        steps.push({
          array: oldStructure.map((item: any, index: number) => ({ 
            value: typeof item === 'object' ? item.value : item, 
            status: index === oldStructure.length - 1 ? 'removing' : 'default' 
          })),
          lineIndex: 0,
          description: `Removing element`
        });
        steps.push({
          array: newStructure.map((item: any) => ({ 
            value: typeof item === 'object' ? item.value : item, 
            status: 'default' 
          })),
          lineIndex: 1,
          description: `After ${operation}`
        });
        break;
        
      default:
        steps.push({
          array: newStructure.map((item: any) => ({ 
            value: typeof item === 'object' ? item.value : item, 
            status: 'default' 
          })),
          lineIndex: 0,
          description: `Operation: ${operation}`
        });
    }
    
    return steps;
  };

  const handleOperation = (operation: string) => {
    try {
      const oldStructure = Array.isArray(structure) ? [...structure] : { ...structure };
      let newStructure;
      let message = '';
      
      switch (dataStructure.id) {
        case 'array':
          newStructure = handleArrayOperation(operation, structure as any[], customInput);
          break;
        case 'stack':
          newStructure = handleStackOperation(operation, structure as any[], customInput);
          break;
        case 'queue':
          newStructure = handleQueueOperation(operation, structure as any[], customInput);
          break;
        case 'linked-list':
          newStructure = handleLinkedListOperation(operation, structure, customInput);
          break;
        case 'binary-tree':
          newStructure = handleBinaryTreeOperation(operation, structure, customInput);
          break;
        case 'hash-table':
          newStructure = handleHashTableOperation(operation, structure, customInput);
          break;
        case 'graph':
          newStructure = handleGraphOperation(operation, structure, customInput);
          break;
        default:
          return;
      }
      
      if (newStructure !== null) {
        setStructure(newStructure.structure);
        setOperationResult(newStructure.result);
        addLogEntry(newStructure.message);
        
        // Create animation steps for visual feedback
        if (Array.isArray(oldStructure) && Array.isArray(newStructure.structure)) {
          const steps = createAnimationSteps(operation, oldStructure, newStructure.structure);
          setAnimationSteps(steps);
          setCurrentStep(0);
          
          // Auto-play animation
          if (steps.length > 1) {
            setIsAnimating(true);
          }
        }
        
        setCustomInput('');
      }
    } catch (error) {
      console.error('Operation error:', error);
      toast({
        title: "Operation Failed",
        description: "An error occurred while performing the operation",
        variant: "destructive",
      });
    }
  };

  // Array operations
  const handleArrayOperation = (operation: string, arr: any[], input: string) => {
    const newArr = [...arr];
    
    switch (operation) {
      case 'add':
        if (!input) return { structure: arr, result: null, message: "Please enter a value to add" };
        const value = isNaN(Number(input)) ? input : Number(input);
        newArr.push(value);
        return { structure: newArr, result: value, message: `Added ${value} to array` };
        
      case 'remove':
        if (newArr.length === 0) return { structure: arr, result: null, message: "Array is empty" };
        const removed = newArr.pop();
        return { structure: newArr, result: removed, message: `Removed ${removed} from array` };
        
      case 'search':
        if (!input) return { structure: arr, result: null, message: "Please enter a value to search" };
        const searchValue = isNaN(Number(input)) ? input : Number(input);
        const index = arr.findIndex(item => item === searchValue);
        return { structure: arr, result: index, message: `Search result: ${index !== -1 ? `Found at index ${index}` : 'Not found'}` };
        
      default:
        return { structure: arr, result: null, message: "Unknown operation" };
    }
  };

  // Stack operations
  const handleStackOperation = (operation: string, stack: any[], input: string) => {
    const newStack = [...stack];
    
    switch (operation) {
      case 'push':
        if (!input) return { structure: stack, result: null, message: "Please enter a value to push" };
        const value = isNaN(Number(input)) ? input : Number(input);
        newStack.unshift(value); // Add to front for visual stack effect
        return { structure: newStack, result: value, message: `Pushed ${value} onto stack` };
        
      case 'pop':
        if (newStack.length === 0) return { structure: stack, result: null, message: "Stack is empty" };
        const popped = newStack.shift(); // Remove from front
        return { structure: newStack, result: popped, message: `Popped ${popped} from stack` };
        
      case 'peek':
        const top = newStack[0];
        return { structure: stack, result: top, message: `Top element: ${top || 'Stack is empty'}` };
        
      default:
        return { structure: stack, result: null, message: "Unknown operation" };
    }
  };

  // Queue operations
  const handleQueueOperation = (operation: string, queue: any[], input: string) => {
    const newQueue = [...queue];
    
    switch (operation) {
      case 'enqueue':
        if (!input) return { structure: queue, result: null, message: "Please enter a value to enqueue" };
        const value = isNaN(Number(input)) ? input : Number(input);
        newQueue.push(value); // Add to rear
        return { structure: newQueue, result: value, message: `Enqueued ${value} to queue` };
        
      case 'dequeue':
        if (newQueue.length === 0) return { structure: queue, result: null, message: "Queue is empty" };
        const dequeued = newQueue.shift(); // Remove from front
        return { structure: newQueue, result: dequeued, message: `Dequeued ${dequeued} from queue` };
        
      default:
        return { structure: queue, result: null, message: "Unknown operation" };
    }
  };

  // Linked List operations (simplified)
  const handleLinkedListOperation = (operation: string, list: any, input: string) => {
    switch (operation) {
      case 'add':
        if (!input) return { structure: list, result: null, message: "Please enter a value to add" };
        const value = isNaN(Number(input)) ? input : Number(input);
        const newNode = { value, next: null };
        const newList = { ...list };
        if (newList.nodes.length === 0) {
          newList.nodes = [newNode];
          newList.head = 0;
        } else {
          newList.nodes.push(newNode);
          // Link the last node to the new node
          if (newList.nodes.length > 1) {
            newList.nodes[newList.nodes.length - 2].next = newList.nodes.length - 1;
          }
        }
        return { structure: newList, result: value, message: `Added ${value} to linked list` };
        
      default:
        return { structure: list, result: null, message: "Operation not implemented yet" };
    }
  };

  // Binary Tree operations (simplified)
  const handleBinaryTreeOperation = (operation: string, tree: any, input: string) => {
    switch (operation) {
      case 'insert':
        if (!input) return { structure: tree, result: null, message: "Please enter a value to insert" };
        const value = isNaN(Number(input)) ? input : Number(input);
        const newTree = { ...tree };
        if (newTree.nodes.length === 0) {
          newTree.nodes = [{ value, left: null, right: null }];
          newTree.root = 0;
        } else {
          newTree.nodes.push({ value, left: null, right: null });
        }
        return { structure: newTree, result: value, message: `Inserted ${value} into binary tree` };
        
      default:
        return { structure: tree, result: null, message: "Operation not implemented yet" };
    }
  };

  // Hash Table operations (simplified)
  const handleHashTableOperation = (operation: string, table: any, input: string) => {
    switch (operation) {
      case 'set':
        if (!input || !input.includes(':')) {
          return { structure: table, result: null, message: "Please enter key:value format" };
        }
        const [key, value] = input.split(':');
        return { structure: table, result: { key, value }, message: `Set ${key} = ${value}` };
        
      default:
        return { structure: table, result: null, message: "Operation not implemented yet" };
    }
  };

  // Graph operations (simplified)
  const handleGraphOperation = (operation: string, graph: any, input: string) => {
    switch (operation) {
      case 'addVertex':
        if (!input) return { structure: graph, result: null, message: "Please enter vertex name" };
        const newGraph = { ...graph };
        newGraph.nodes.push({ 
          id: input, 
          x: Math.random() * 300 + 50, 
          y: Math.random() * 200 + 50 
        });
        return { structure: newGraph, result: input, message: `Added vertex ${input}` };
        
      default:
        return { structure: graph, result: null, message: "Operation not implemented yet" };
    }
  };

  return {
    customInput,
    structure,
    operationResult,
    operationLog,
    animationSteps,
    currentStep,
    isAnimating,
    setCustomInput,
    resetToDefault,
    handleOperation,
    handleInputChange,
    setCurrentStep,
    setIsAnimating
  };
};
