import { useState, useEffect } from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { VisualizationStep } from '../../types/visualizer';
import { toast } from '../../hooks/use-toast';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { visualizeBubbleSort, visualizeInsertionSort, visualizeMergeSort, visualizeQuickSort, visualizeHeapSort } from '../../utils/visualizations/sort-visualizations';
import {
  rebuildLinkedList,
  stackPush,
  stackPop,
  stackPeek,
  queueEnqueue,
  queueDequeue,
  queuePeek,
  treeTraversalOrder,
  graphAddNode,
  graphRemoveNode,
  graphAddEdge,
  graphRemoveEdge,
} from './dataStructureLogic';


export const useDataStructureState = (dataStructure: DataStructure) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [animationSteps, setAnimationSteps] = useState<VisualizationStep[]>([]);
  const [treeMode, setTreeMode] = useState<'binary' | 'balanced'>('binary');

  const {
    currentStep,
    isPlaying: isAnimating,
    speed,
    setSpeed,
    setCurrentStep,
    setIsPlaying: setIsAnimating,
    togglePlayPause,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    reset: resetAnimation,
  } = useUnifiedAnimationController<VisualizationStep>({
    steps: animationSteps,
    onApplyStep: (step) => {
      if (step.structure !== undefined) {
        setStructure(step.structure);
      }
    },
    initialSpeed: 1,
  });
  
  useEffect(() => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setAnimationSteps([]);
resetAnimation();
  }, [dataStructure.id]);
  
  const resetToDefault = () => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setAnimationSteps([]);
resetAnimation();
    toast({
      title: "Reset Complete",
      description: `${dataStructure.name} has been reset to default state`,
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const toArrayFrame = (value: any) => (Array.isArray(value)
    ? value.map((item: any) => ({ value: typeof item === 'object' ? item.value : item, status: 'default' as const }))
    : []);

  const createAnimationSteps = (operation: string, oldStructure: any, newStructure: any) => {
    const oldArray = toArrayFrame(oldStructure);
    const newArray = toArrayFrame(newStructure);

    return [
      {
        array: oldArray,
        structure: oldStructure,
        lineIndex: 0,
        description: `Before ${operation}`
      },
      {
        array: newArray,
        structure: newStructure,
        lineIndex: 1,
        description: `After ${operation}`
      }
    ] as VisualizationStep[];
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
        
        const sortingOps: Record<string, (arr: number[]) => VisualizationStep[]> = {
          'bubble-sort': visualizeBubbleSort,
          'insertion-sort': visualizeInsertionSort,
          'merge-sort': visualizeMergeSort,
          'quick-sort': visualizeQuickSort,
          'heap-sort': visualizeHeapSort,
        };

        const steps = Array.isArray(newStructure.structure) && sortingOps[operation]
          ? sortingOps[operation](newStructure.structure.map((value: any) => Number(value)))
          : createAnimationSteps(operation, oldStructure, newStructure.structure);

        setAnimationSteps(steps);

        if (steps.length > 0) {
          setCurrentStep(0);
        }

        if (steps.length > 1) {
          setIsAnimating(true);
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

  // Enhanced Array operations
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
        
      case 'update':
        if (!input || !input.includes(':')) {
          return { structure: arr, result: null, message: "Please enter index:value format (e.g., 2:50)" };
        }
        const [indexStr, newValue] = input.split(':');
        const updateIndex = parseInt(indexStr);
        const updateValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
        
        if (updateIndex < 0 || updateIndex >= newArr.length) {
          return { structure: arr, result: null, message: "Index out of bounds" };
        }
        
        const oldValue = newArr[updateIndex];
        newArr[updateIndex] = updateValue;
        return { structure: newArr, result: updateValue, message: `Updated index ${updateIndex} from ${oldValue} to ${updateValue}` };
        
      case 'bubble-sort':
        const bubbleSorted = [...newArr].sort((a, b) => a - b);
        return { structure: bubbleSorted, result: null, message: "Array sorted using bubble sort algorithm" };
        
      case 'selection-sort':
        const selectionSorted = [...newArr].sort((a, b) => a - b);
        return { structure: selectionSorted, result: null, message: "Array sorted using selection sort algorithm" };
      case 'insertion-sort':
        return { structure: [...newArr].sort((a, b) => a - b), result: null, message: 'Array sorted using insertion sort algorithm' };
      case 'merge-sort':
        return { structure: [...newArr].sort((a, b) => a - b), result: null, message: 'Array sorted using merge sort algorithm' };
      case 'quick-sort':
        return { structure: [...newArr].sort((a, b) => a - b), result: null, message: 'Array sorted using quick sort algorithm' };
      case 'heap-sort':
        return { structure: [...newArr].sort((a, b) => a - b), result: null, message: 'Array sorted using heap sort algorithm' };
        
      case 'shuffle':
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return { structure: newArr, result: null, message: "Array shuffled randomly" };
        
      default:
        return { structure: arr, result: null, message: "Unknown operation" };
    }
  };

  // Enhanced Linked List operations
  const handleLinkedListOperation = (operation: string, list: any, input: string) => {
    switch (operation) {
      case 'insert-beginning':
        if (!input) return { structure: list, result: null, message: "Please enter a value to insert" };
        const value = isNaN(Number(input)) ? input : Number(input);
        const newNode = { value, next: list.head !== null ? list.head : null };
        const newList = { ...list };
        newList.nodes = [newNode, ...newList.nodes];
        newList.head = 0;
        // Update next pointers
        for (let i = 1; i < newList.nodes.length; i++) {
          if (newList.nodes[i].next !== null) {
            newList.nodes[i].next += 1;
          }
        }
        return { structure: newList, result: value, message: `Inserted ${value} at the beginning` };
        
      case 'insert-index':
        if (!input || !input.includes(':')) return { structure: list, result: null, message: 'Use index:value' };
        const [idxRaw, valRaw] = input.split(':');
        const idxNum = Math.max(0, Math.min(Number(idxRaw), (list.nodes || []).length));
        const val = isNaN(Number(valRaw)) ? valRaw : Number(valRaw);
        {
          const values = (list.nodes || []).map((n: any) => n.value);
          values.splice(idxNum, 0, val);
          return { structure: rebuildLinkedList(values, list.type || 'singly'), result: val, message: `Inserted ${val} at index ${idxNum}` };
        }

      case 'insert-end':
        if (!input) return { structure: list, result: null, message: "Please enter a value to insert" };
        const endValue = isNaN(Number(input)) ? input : Number(input);
        const endNode = { value: endValue, next: null, prev: null };
        const endList = { ...list, nodes: [...(list.nodes || [])] };
        
        if (endList.nodes.length === 0) {
          endList.nodes = [endNode];
          endList.head = 0;
        } else {
          const lastIndex = endList.nodes.length - 1;
          endList.nodes[lastIndex].next = endList.nodes.length;
          endNode.prev = endList.type?.includes('doubly') ? lastIndex : null;
          endList.nodes.push(endNode);
        }
        return { structure: endList, result: endValue, message: `Inserted ${endValue} at the end` };

      case 'delete-head': {
        const values = (list.nodes || []).map((n: any) => n.value);
        const removed = values.shift();
        return { structure: rebuildLinkedList(values, list.type || 'singly'), result: removed, message: `Deleted head` };
      }

      case 'delete-tail': {
        const values = (list.nodes || []).map((n: any) => n.value);
        const removed = values.pop();
        return { structure: rebuildLinkedList(values, list.type || 'singly'), result: removed, message: `Deleted tail` };
      }

      case 'delete-index': {
        if (!input) return { structure: list, result: null, message: 'Please enter index to delete' };
        const values = (list.nodes || []).map((n: any) => n.value);
        const idx = Number(input);
        if (Number.isNaN(idx) || idx < 0 || idx >= values.length) return { structure: list, result: null, message: 'Invalid index' };
        const [removed] = values.splice(idx, 1);
        return { structure: rebuildLinkedList(values, list.type || 'singly'), result: removed, message: `Deleted index ${idx}` };
      }

      case 'search': {
        if (!input) return { structure: list, result: null, message: 'Please enter a value to search' };
        const target = isNaN(Number(input)) ? input : Number(input);
        const idx = (list.nodes || []).findIndex((node: any) => node.value === target);
        return { structure: list, result: idx, message: idx >= 0 ? `Found ${target} at node ${idx}` : `${target} not found` };
      }

      case 'change-type-singly':
      case 'change-type-doubly':
      case 'change-type-circular':
      case 'change-type-circular-doubly': {
        const nextType = operation.replace('change-type-', '') as any;
        const nodes = (list.nodes || []).map((node: any, idx: number, arr: any[]) => ({
          ...node,
          next: nextType.includes('circular') ? (idx === arr.length - 1 ? 0 : idx + 1) : (idx < arr.length - 1 ? idx + 1 : null),
          prev: nextType.includes('doubly') ? (idx === 0 ? (nextType.includes('circular') && arr.length ? arr.length - 1 : null) : idx - 1) : undefined,
        }));
        return { structure: { ...list, type: nextType, nodes, head: nodes.length ? 0 : null }, result: nextType, message: `Switched to ${nextType}` };
      }
        
      case 'reverse':
        const reversedList = { ...list };
        if (reversedList.nodes.length <= 1) {
          return { structure: list, result: null, message: "List has 0 or 1 elements, nothing to reverse" };
        }
        
        // Simple reverse by reversing the values array
        const values = [];
        let current = reversedList.head;
        while (current !== null && current < reversedList.nodes.length) {
          values.push(reversedList.nodes[current].value);
          current = reversedList.nodes[current].next;
        }
        values.reverse();
        
        // Rebuild the list with reversed values
        reversedList.nodes = values.map((val, index) => ({
          value: val,
          next: index < values.length - 1 ? index + 1 : null
        }));
        
        return { structure: reversedList, result: null, message: "Linked list reversed successfully" };
        
      default:
        return { structure: list, result: null, message: "Operation not implemented yet" };
    }
  };

  // Stack operations
  const handleStackOperation = (operation: string, stack: any[], input: string) => {
    const newStack = [...stack];
    
    switch (operation) {
      case 'push':
        if (!input) return { structure: stack, result: null, message: "Please enter a value to push" };
        const value = isNaN(Number(input)) ? input : Number(input);
        return { structure: stackPush(stack, value), result: value, message: `Pushed ${value} onto stack` };
        
      case 'pop':
        if (newStack.length === 0) return { structure: stack, result: null, message: "Stack is empty" };
        const popped = stackPop(stack);
        return { structure: popped.stack, result: popped.value, message: `Popped ${popped.value} from stack` };
        
      case 'peek':
        const top = stackPeek(stack);
        return { structure: stack, result: top, message: `Top element: ${top ?? 'Stack is empty'}` };
        
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
        return { structure: queueEnqueue(queue, value), result: value, message: `Enqueued ${value} to queue` };
        
      case 'dequeue':
        if (newQueue.length === 0) return { structure: queue, result: null, message: "Queue is empty" };
        const dequeued = queueDequeue(queue);
        return { structure: dequeued.queue, result: dequeued.value, message: `Dequeued ${dequeued.value} from queue` };
        
      case 'peek':
        const front = queuePeek(queue);
        return { structure: queue, result: front, message: `Front element: ${front ?? 'Queue is empty'}` };
      default:
        return { structure: queue, result: null, message: "Unknown operation" };
    }
  };

  // Tree operations
  const buildBinaryTree = (balanced: boolean) => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    const ordered = [...values].sort((a, b) => a - b);
    const nodes: any[] = [];

    if (balanced) {
      const build = (arr: number[]): number | null => {
        if (!arr.length) return null;
        const mid = Math.floor(arr.length / 2);
        const index = nodes.length;
        nodes.push({ value: arr[mid], left: null, right: null, status: 'default' });
        nodes[index].left = build(arr.slice(0, mid));
        nodes[index].right = build(arr.slice(mid + 1));
        return index;
      };
      const root = build(ordered);
      return { nodes, root };
    }

    values.forEach((value, idx) => nodes.push({ value, left: 2 * idx + 1 < values.length ? 2 * idx + 1 : null, right: 2 * idx + 2 < values.length ? 2 * idx + 2 : null, status: 'default' }));
    return { nodes, root: 0 };
  };

  const buildTraversalFrames = (tree: any, order: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    const steps: VisualizationStep[] = [];
    const nodes = tree.nodes;
    const traversal = treeTraversalOrder(tree, order);
    steps.push({ array: [], structure: tree, lineIndex: 0, description: `Starting ${order} traversal` });

    const visited = new Set<number>();
    traversal.forEach((idx, stepIndex) => {
      visited.add(idx);
      const frameTree = {
        ...tree,
        nodes: tree.nodes.map((node: any, nodeIndex: number) => ({
          ...node,
          status: nodeIndex === idx ? 'current' : visited.has(nodeIndex) ? 'visited' : 'default',
        })),
      };
      steps.push({ array: [], structure: frameTree, lineIndex: stepIndex + 1, description: `Visit ${tree.nodes[idx].value}` });
    });

    return steps;
  };

  const handleBinaryTreeOperation = (operation: string, tree: any, input: string) => {
    if (operation === 'generate' || operation === 'generate-balanced') {
      const balanced = operation === 'generate-balanced' || treeMode === 'balanced';
      const generated = buildBinaryTree(balanced);
      return { structure: generated, result: null, message: `Generated ${balanced ? 'balanced tree' : 'binary tree'} example` };
    }

    if (operation === 'inorder' || operation === 'preorder' || operation === 'postorder' || operation === 'levelorder') {
      const traversalSteps = buildTraversalFrames(tree, operation);
      setAnimationSteps(traversalSteps);
      setCurrentStep(0);
      setIsAnimating(true);
      return { structure: tree, result: traversalSteps.length, message: `${operation} traversal started` };
    }

    return { structure: tree, result: null, message: 'Operation not implemented yet' };
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

  // Graph operations
  const handleGraphOperation = (operation: string, graph: any, input: string) => {
    if (operation === 'generate') {
      const nodes = Array.from({ length: 6 }, (_, i) => ({
        id: String.fromCharCode(65 + i),
        x: 80 + (i % 3) * 180,
        y: 80 + Math.floor(i / 3) * 180,
      }));
      const edges = [
        { source: 'A', target: 'B', weight: 2 },
        { source: 'A', target: 'D', weight: 4 },
        { source: 'B', target: 'C', weight: 1 },
        { source: 'B', target: 'E', weight: 7 },
        { source: 'C', target: 'F', weight: 3 },
        { source: 'D', target: 'E', weight: 1 },
        { source: 'E', target: 'F', weight: 2 },
      ];
      return { structure: { nodes, edges }, result: null, message: 'Generated graph example' };
    }

    if (operation === 'bfs' || operation === 'dfs') {
      const start = graph.nodes?.[0]?.id;
      const visited = new Set<string>();
      const frontier = [start];
      const steps: VisualizationStep[] = [];
      while (frontier.length) {
        const current = operation === 'bfs' ? frontier.shift()! : frontier.pop()!;
        if (!current || visited.has(current)) continue;
        visited.add(current);
        const frame = {
          ...graph,
          nodes: graph.nodes.map((node: any) => ({ ...node, status: node.id === current ? 'current' : visited.has(node.id) ? 'visited' : 'default' })),
        };
        steps.push({ array: [], structure: frame, lineIndex: steps.length, description: `${operation.toUpperCase()} visit ${current}` });
        const neighbors = (graph.edges || [])
          .filter((edge: any) => edge.source === current || edge.target === current)
          .map((edge: any) => (edge.source === current ? edge.target : edge.source));
        neighbors.forEach((n: string) => {
          if (!visited.has(n)) frontier.push(n);
        });
      }
      setAnimationSteps(steps);
      setCurrentStep(0);
      setIsAnimating(true);
      return { structure: graph, result: steps.length, message: `${operation.toUpperCase()} traversal started` };
    }

    if (operation === 'toggle-directed') {
      return { structure: { ...graph, directed: !graph.directed }, result: !graph.directed, message: `Directed: ${!graph.directed}` };
    }

    if (operation === 'toggle-weighted') {
      return { structure: { ...graph, weighted: !graph.weighted }, result: !graph.weighted, message: `Weighted: ${!graph.weighted}` };
    }

    if (operation === 'add-node') {
      if (!input) return { structure: graph, result: null, message: 'Enter node id' };
      return { structure: graphAddNode(graph, input.trim().toUpperCase()), result: input, message: `Added node ${input}` };
    }

    if (operation === 'remove-node') {
      if (!input) return { structure: graph, result: null, message: 'Enter node id' };
      return { structure: graphRemoveNode(graph, input.trim().toUpperCase()), result: input, message: `Removed node ${input}` };
    }

    if (operation === 'add-edge') {
      if (!input || !input.includes('-')) return { structure: graph, result: null, message: 'Use SOURCE-TARGET[:weight]' };
      const [pair, weightRaw] = input.split(':');
      const [s, t] = pair.split('-').map((v) => v.trim().toUpperCase());
      const weight = Math.max(1, Number(weightRaw || 1));
      return { structure: graphAddEdge(graph, s, t, graph.weighted ? weight : 1), result: `${s}-${t}`, message: `Added edge ${s}-${t}` };
    }

    if (operation === 'remove-edge') {
      if (!input || !input.includes('-')) return { structure: graph, result: null, message: 'Use SOURCE-TARGET' };
      const [s, t] = input.split('-').map((v) => v.trim().toUpperCase());
      return { structure: graphRemoveEdge(graph, s, t), result: `${s}-${t}`, message: `Removed edge ${s}-${t}` };
    }

    return { structure: graph, result: null, message: 'Operation not implemented yet' };
  };


  const generateContextualExample = () => {
    const randomNumber = () => Math.floor(Math.random() * 90) + 10;
    switch (dataStructure.id) {
      case 'array':
        return Array.from({ length: 6 }, randomNumber);
      case 'stack':
        return ['Undo: type', 'Undo: delete', 'Undo: move'];
      case 'queue':
        return ['Ticket-101', 'Ticket-102', 'Ticket-103'];
      case 'linked-list': {
        const types = ['singly', 'doubly', 'circular'];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = 3 + Math.floor(Math.random() * 4);
        const nodes = Array.from({ length: size }, (_, index) => ({
          value: randomNumber(),
          next: type === 'circular' ? (index === size - 1 ? 0 : index + 1) : (index < size - 1 ? index + 1 : null),
          prev: type === 'doubly' ? (index === 0 ? null : index - 1) : undefined,
        }));
        return { nodes, head: size ? 0 : null, type };
      }
      case 'binary-tree':
        return buildBinaryTree(treeMode === 'balanced');
      case 'graph':
        return {
          nodes: [
            { id: 'A', x: 100, y: 90 },
            { id: 'B', x: 260, y: 80 },
            { id: 'C', x: 420, y: 90 },
            { id: 'D', x: 180, y: 220 },
            { id: 'E', x: 340, y: 220 }
          ],
          edges: [
            { source: 'A', target: 'B', weight: 2 },
            { source: 'B', target: 'C', weight: 3 },
            { source: 'A', target: 'D', weight: 4 },
            { source: 'D', target: 'E', weight: 1 },
            { source: 'E', target: 'C', weight: 2 }
          ],
          directed: false,
          weighted: true
        };
      default:
        return dataStructure.defaultExample;
    }
  };

  const generateContextExample = () => {
    const nextExample = generateContextualExample();
    setStructure(nextExample);
    setAnimationSteps([{ array: Array.isArray(nextExample) ? nextExample.map((item: any) => ({ value: item, status: "default" as const })) : [], structure: nextExample, lineIndex: 0, description: "Generated contextual example" }]);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const generateRandomExample = () => {
    let nextExample = generateContextualExample();
    if (dataStructure.id === 'binary-tree') {
      const previous = typeof window !== 'undefined' ? window.localStorage.getItem(`tree-example-${treeMode}`) : null;
      let guard = 0;
      while (previous && JSON.stringify(nextExample) === previous && guard < 5) {
        nextExample = generateContextualExample();
        guard += 1;
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`tree-example-${treeMode}`, JSON.stringify(nextExample));
      }
    }
    setStructure(nextExample);
    setAnimationSteps([
      {
        array: Array.isArray(nextExample) ? nextExample.map((item: any) => ({ value: item, status: 'default' as const })) : [],
        structure: nextExample,
        lineIndex: 0,
        description: 'Generated contextual example',
      },
    ]);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return {
    customInput,
    structure,
    operationResult,
    animationSteps,
    currentStep,
    isAnimating,
    setCustomInput,
    resetToDefault,
    generateRandomExample,
    generateContextExample,
    treeMode,
    setTreeMode,
    handleOperation,
    handleInputChange,
    setCurrentStep,
    setIsAnimating,
    speed,
    setSpeed,
    togglePlayPause,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    resetAnimation,
    clearStructure: () => { setStructure(Array.isArray(structure) ? [] : { nodes: [], edges: [], root: null, head: null, type: treeMode }); setAnimationSteps([]); setCurrentStep(0); setIsAnimating(false); }
  };
};
