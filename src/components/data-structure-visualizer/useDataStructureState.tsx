
import { useState, useRef, useEffect } from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { 
  visualizeArrayOperation, 
  visualizeStackOperation, 
  visualizeQueueOperation 
} from '../../utils/visualizations';
import { toast } from '../../hooks/use-toast';
import { VisualizationStep } from '../../types/visualizer';

export const useDataStructureState = (dataStructure: DataStructure) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [animationSteps, setAnimationSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Reset animation state when data structure changes
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
  };
  
  const addLogEntry = (message: string) => {
    setOperationLog(prev => [...prev, message]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };
  
  // Handle animation steps
  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setIsAnimating(false);
      }
    }
  }, [isAnimating, currentStep, animationSteps]);
  
  const handleOperation = (operation: string) => {
    try {
      let result;
      let newStructure = { ...structure };
      let steps: VisualizationStep[] = [];
      
      switch (dataStructure.id) {
        case 'array':
          if (operation === 'add') {
            if (!customInput) {
              addLogEntry("Please enter a value to add");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            steps = visualizeArrayOperation(structure as any[], 'add', value);
            newStructure = [...(structure as any[]), value];
            addLogEntry(`Added ${value} to the array`);
          } else if (operation === 'remove') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Array is empty");
              return;
            }
            steps = visualizeArrayOperation(structure as any[], 'remove', null);
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).pop();
            addLogEntry(`Removed ${result} from the array`);
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            steps = visualizeArrayOperation(structure as any[], 'search', value);
            result = (structure as any[]).indexOf(value);
            addLogEntry(`Search result: ${result === -1 ? 'Not found' : `Found at index ${result}`}`);
          }
          break;
          
        case 'linked-list':
          if (operation === 'add') {
            if (!customInput) {
              addLogEntry("Please enter a value to add");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            const newNode = { value, next: null };
            const newNodes = [...(structure as any).nodes];
            
            if (newNodes.length === 0) {
              newNodes.push(newNode);
              newStructure = { nodes: newNodes, head: 0 };
            } else {
              const lastNodeIndex = newNodes.length - 1;
              newNodes[lastNodeIndex].next = newNodes.length;
              newNodes.push(newNode);
              newStructure = { ...structure, nodes: newNodes };
            }
            addLogEntry(`Added ${value} to the linked list`);
          } else if (operation === 'remove') {
            const { nodes, head } = structure as any;
            if (nodes.length === 0 || head === null) {
              addLogEntry("Linked list is empty");
              return;
            }
            
            const newNodes = [...nodes];
            result = newNodes[head].value;
            
            if (newNodes[head].next === null) {
              newStructure = { nodes: [], head: null };
            } else {
              newStructure = { nodes: newNodes, head: newNodes[head].next };
            }
            addLogEntry(`Removed ${result} from the linked list`);
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            const { nodes, head } = structure as any;
            let found = false;
            let current = head;
            let index = 0;
            
            while (current !== null) {
              if (nodes[current].value === value) {
                found = true;
                break;
              }
              current = nodes[current].next;
              index++;
            }
            
            addLogEntry(`Search result: ${found ? `Found at position ${index}` : 'Not found'}`);
          }
          break;
          
        case 'stack':
          if (operation === 'push') {
            if (!customInput) {
              addLogEntry("Please enter a value to push");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            steps = visualizeStackOperation(structure as any[], 'push', value);
            newStructure = [value, ...(structure as any[])];
            addLogEntry(`Pushed ${value} onto the stack`);
          } else if (operation === 'pop') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            steps = visualizeStackOperation(structure as any[], 'pop');
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).shift();
            addLogEntry(`Popped ${result} from the stack`);
          } else if (operation === 'peek') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            steps = visualizeStackOperation(structure as any[], 'peek');
            result = (structure as any[])[0];
            addLogEntry(`Top element: ${result}`);
          }
          break;
          
        case 'queue':
          if (operation === 'enqueue') {
            if (!customInput) {
              addLogEntry("Please enter a value to enqueue");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            steps = visualizeQueueOperation(structure as any[], 'enqueue', value);
            newStructure = [...(structure as any[]), value];
            addLogEntry(`Enqueued ${value} to the queue`);
          } else if (operation === 'dequeue') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Queue is empty");
              return;
            }
            steps = visualizeQueueOperation(structure as any[], 'dequeue');
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).shift();
            addLogEntry(`Dequeued ${result} from the queue`);
          }
          break;
          
        case 'binary-tree':
          // Binary tree operations
          if (operation === 'insert') {
            if (!customInput) {
              addLogEntry("Please enter a value to insert");
              return;
            }
            // Binary tree insertion logic would go here
          }
          break;
          
        case 'hash-table':
          // Hash table operations
          if (operation === 'set') {
            // Hash table set logic would go here
          }
          break;
          
        case 'graph':
          // Graph operations
          if (operation === 'addVertex') {
            // Graph add vertex logic would go here
          }
          break;
          
        default:
          addLogEntry("Operation not supported for this data structure yet");
      }
      
      if (steps.length > 0) {
        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsAnimating(true);
      }
      
      setStructure(newStructure);
      setOperationResult(result);
      setCustomInput('');
    } catch (error) {
      console.error(error);
      addLogEntry(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Operation Error",
        description: `${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
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
    addLogEntry
  };
};
