
import { useArrayOperations } from './useArrayOperations';
import { useStackOperations } from './useStackOperations';
import { useQueueOperations } from './useQueueOperations';
import { useLinkedListOperations } from './useLinkedListOperations';

export const useOperationHandler = (
  dataStructureId: string,
  structure: any,
  customInput: string,
  setStructure: React.Dispatch<React.SetStateAction<any>>,
  addLogEntry: (message: string) => void,
  setAnimationSteps: React.Dispatch<React.SetStateAction<any[]>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>,
  setOperationResult: React.Dispatch<React.SetStateAction<any>>,
  setCustomInput: React.Dispatch<React.SetStateAction<string>>
) => {
  const arrayOps = useArrayOperations(
    structure, customInput, setStructure, addLogEntry,
    setAnimationSteps, setCurrentStep, setIsAnimating, setOperationResult, setCustomInput
  );
  
  const stackOps = useStackOperations(
    structure, customInput, setStructure, addLogEntry,
    setAnimationSteps, setCurrentStep, setIsAnimating, setOperationResult, setCustomInput
  );
  
  const queueOps = useQueueOperations(
    structure, customInput, setStructure, addLogEntry,
    setAnimationSteps, setCurrentStep, setIsAnimating, setOperationResult, setCustomInput
  );
  
  const linkedListOps = useLinkedListOperations(
    structure, customInput, setStructure, addLogEntry, setOperationResult, setCustomInput
  );

  const handleOperation = (operation: string) => {
    console.log('Handling operation:', operation, 'for structure:', dataStructureId);
    
    try {
      switch (dataStructureId) {
        case 'array':
          switch (operation) {
            case 'add':
            case 'insert':
              return arrayOps.handleAdd();
            case 'remove':
            case 'delete':
              return arrayOps.handleRemove();
            case 'search':
              return arrayOps.handleSearch();
            case 'bubble-sort':
              return handleBubbleSort();
            case 'selection-sort':
              return handleSelectionSort();
            case 'shuffle':
              return handleShuffle();
            default:
              addLogEntry(`Operation ${operation} not implemented for arrays`);
          }
          break;
          
        case 'stack':
          switch (operation) {
            case 'push':
              return stackOps.handlePush();
            case 'pop':
              return stackOps.handlePop();
            case 'peek':
              return stackOps.handlePeek();
            case 'reverse':
              return handleStackReverse();
            case 'check-balanced':
              return handleCheckBalanced();
            default:
              addLogEntry(`Operation ${operation} not implemented for stacks`);
          }
          break;
          
        case 'queue':
          switch (operation) {
            case 'enqueue':
              return queueOps.handleEnqueue();
            case 'dequeue':
              return queueOps.handleDequeue();
            case 'front':
              return handleQueueFront();
            default:
              addLogEntry(`Operation ${operation} not implemented for queues`);
          }
          break;
          
        case 'linked-list':
          switch (operation) {
            case 'insert-beginning':
            case 'insert-head':
              return linkedListOps.handleAdd();
            case 'insert-end':
            case 'insert-tail':
              return handleInsertAtTail();
            case 'delete':
            case 'remove':
              return linkedListOps.handleRemove();
            case 'search':
              return linkedListOps.handleSearch();
            case 'reverse':
              return handleReverseLinkedList();
            default:
              if (operation.startsWith('change-type-')) {
                return handleChangeListType(operation.replace('change-type-', ''));
              }
              addLogEntry(`Operation ${operation} not implemented for linked lists`);
          }
          break;
          
        case 'binary-tree':
          return handleTreeOperation(operation);
        case 'hash-table':
          return handleHashTableOperation(operation);
        case 'graph':
          return handleGraphOperation(operation);
        default:
          addLogEntry(`Data structure ${dataStructureId} not supported`);
      }
    } catch (error) {
      console.error('Operation error:', error);
      addLogEntry(`Error during ${operation}: ${error.message}`);
    }
  };

  // Additional operation handlers
  const handleBubbleSort = () => {
    if (!Array.isArray(structure) || structure.length === 0) {
      addLogEntry("Cannot sort empty array");
      return;
    }
    
    const sortedArray = [...structure];
    const steps = [];
    
    for (let i = 0; i < sortedArray.length - 1; i++) {
      for (let j = 0; j < sortedArray.length - i - 1; j++) {
        steps.push({
          array: sortedArray.map((item, index) => ({
            value: item,
            status: index === j || index === j + 1 ? 'comparing' : 'default'
          })),
          lineIndex: steps.length,
          description: `Comparing ${sortedArray[j]} and ${sortedArray[j + 1]}`
        });
        
        if (sortedArray[j] > sortedArray[j + 1]) {
          [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
          
          steps.push({
            array: sortedArray.map((item, index) => ({
              value: item,
              status: index === j || index === j + 1 ? 'swapping' : 'default'
            })),
            lineIndex: steps.length,
            description: `Swapped ${sortedArray[j + 1]} and ${sortedArray[j]}`
          });
        }
      }
    }
    
    steps.push({
      array: sortedArray.map(item => ({ value: item, status: 'sorted' })),
      lineIndex: steps.length,
      description: 'Array is now sorted!'
    });
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    setTimeout(() => {
      setStructure(sortedArray);
    }, steps.length * 500);
    
    addLogEntry('Bubble sort completed');
  };

  const handleSelectionSort = () => {
    if (!Array.isArray(structure) || structure.length === 0) {
      addLogEntry("Cannot sort empty array");
      return;
    }
    
    const sortedArray = [...structure];
    const steps = [];
    
    for (let i = 0; i < sortedArray.length - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < sortedArray.length; j++) {
        steps.push({
          array: sortedArray.map((item, index) => ({
            value: item,
            status: index === minIndex ? 'current' : index === j ? 'comparing' : 'default'
          })),
          lineIndex: steps.length,
          description: `Comparing minimum ${sortedArray[minIndex]} with ${sortedArray[j]}`
        });
        
        if (sortedArray[j] < sortedArray[minIndex]) {
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        [sortedArray[i], sortedArray[minIndex]] = [sortedArray[minIndex], sortedArray[i]];
        
        steps.push({
          array: sortedArray.map((item, index) => ({
            value: item,
            status: index === i || index === minIndex ? 'swapping' : 'default'
          })),
          lineIndex: steps.length,
          description: `Swapped ${sortedArray[minIndex]} and ${sortedArray[i]}`
        });
      }
    }
    
    steps.push({
      array: sortedArray.map(item => ({ value: item, status: 'sorted' })),
      lineIndex: steps.length,
      description: 'Selection sort completed!'
    });
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    setTimeout(() => {
      setStructure(sortedArray);
    }, steps.length * 500);
    
    addLogEntry('Selection sort completed');
  };

  const handleShuffle = () => {
    if (!Array.isArray(structure) || structure.length === 0) {
      addLogEntry("Cannot shuffle empty array");
      return;
    }
    
    const shuffledArray = [...structure];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    setStructure(shuffledArray);
    addLogEntry('Array shuffled');
  };

  const handleStackReverse = () => {
    if (!Array.isArray(structure) || structure.length === 0) {
      addLogEntry("Cannot reverse empty stack");
      return;
    }
    
    const reversed = [...structure].reverse();
    setStructure(reversed);
    addLogEntry('Stack reversed');
  };

  const handleCheckBalanced = () => {
    if (!customInput.trim()) {
      addLogEntry("Please enter a string with parentheses to check");
      return;
    }
    
    const stack = [];
    const opening = ['(', '[', '{'];
    const closing = [')', ']', '}'];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    
    for (const char of customInput) {
      if (opening.includes(char)) {
        stack.push(char);
      } else if (closing.includes(char)) {
        if (stack.length === 0 || stack.pop() !== pairs[char]) {
          setOperationResult(false);
          addLogEntry(`String "${customInput}" is NOT balanced`);
          return;
        }
      }
    }
    
    const isBalanced = stack.length === 0;
    setOperationResult(isBalanced);
    addLogEntry(`String "${customInput}" is ${isBalanced ? 'balanced' : 'NOT balanced'}`);
  };

  const handleQueueFront = () => {
    if (!Array.isArray(structure) || structure.length === 0) {
      addLogEntry("Queue is empty - no front element");
      setOperationResult(null);
      return;
    }
    
    const front = structure[0];
    setOperationResult(front);
    addLogEntry(`Front element is: ${front}`);
  };

  const handleInsertAtTail = () => {
    if (!customInput.trim()) {
      addLogEntry("Please enter a value to insert");
      return;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const newNode = { value, next: null };
    const newNodes = [...structure.nodes];
    
    if (newNodes.length === 0) {
      newNodes.push(newNode);
      setStructure({ nodes: newNodes, head: 0 });
    } else {
      const lastIndex = newNodes.length - 1;
      newNodes[lastIndex].next = newNodes.length;
      newNodes.push(newNode);
      setStructure({ ...structure, nodes: newNodes });
    }
    
    addLogEntry(`Inserted ${value} at tail`);
    setCustomInput('');
  };

  const handleReverseLinkedList = () => {
    const { nodes, head } = structure;
    if (nodes.length === 0 || head === null) {
      addLogEntry("Cannot reverse empty linked list");
      return;
    }
    
    const newNodes = [...nodes];
    let current = head;
    let prev = null;
    
    while (current !== null) {
      const next = newNodes[current].next;
      newNodes[current].next = prev;
      prev = current;
      current = next;
    }
    
    setStructure({ nodes: newNodes, head: prev });
    addLogEntry("Linked list reversed");
  };

  const handleChangeListType = (type: string) => {
    addLogEntry(`Changed to ${type} linked list`);
    // Type change would affect the rendering logic
  };

  const handleTreeOperation = (operation: string) => {
    addLogEntry(`Tree operation ${operation} not yet implemented`);
  };

  const handleHashTableOperation = (operation: string) => {
    addLogEntry(`Hash table operation ${operation} not yet implemented`);
  };

  const handleGraphOperation = (operation: string) => {
    addLogEntry(`Graph operation ${operation} not yet implemented`);
  };

  return { handleOperation };
};
