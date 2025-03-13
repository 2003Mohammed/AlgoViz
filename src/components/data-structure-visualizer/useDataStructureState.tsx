
import { useState, ChangeEvent } from 'react';
import { DataStructure } from '../../utils/dataStructureData';

export const useDataStructureState = (dataStructure: DataStructure) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  
  const resetToDefault = () => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
  };
  
  const addLogEntry = (message: string) => {
    setOperationLog(prev => [...prev, message]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };
  
  const handleOperation = (operation: string) => {
    try {
      let result;
      let newStructure = { ...structure };
      
      switch (dataStructure.id) {
        case 'array':
          if (operation === 'add') {
            if (!customInput) {
              addLogEntry("Please enter a value to add");
              return;
            }
            const value = Number(customInput) || customInput;
            newStructure = [...(structure as any[]), value];
            addLogEntry(`Added ${value} to the array`);
          } else if (operation === 'remove') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Array is empty");
              return;
            }
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).pop();
            addLogEntry(`Removed ${result} from the array`);
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = Number(customInput) || customInput;
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
            const value = Number(customInput) || customInput;
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
            const value = Number(customInput) || customInput;
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
            const value = Number(customInput) || customInput;
            newStructure = [(value), ...(structure as any[])];
            addLogEntry(`Pushed ${value} onto the stack`);
          } else if (operation === 'pop') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).shift();
            addLogEntry(`Popped ${result} from the stack`);
          } else if (operation === 'peek') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            result = (structure as any[])[0];
            addLogEntry(`Top element: ${result}`);
          }
          break;
          
        // Additional cases for other data structures would go here
        
        default:
          addLogEntry("Operation not supported for this data structure yet");
      }
      
      setStructure(newStructure);
      setOperationResult(result);
      setCustomInput('');
    } catch (error) {
      console.error(error);
      addLogEntry(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    customInput,
    structure,
    operationResult,
    operationLog,
    setCustomInput,
    resetToDefault,
    handleOperation,
    handleInputChange,
    addLogEntry
  };
};
