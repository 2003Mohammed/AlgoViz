
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
  // Initialize operation hooks
  const arrayOperations = useArrayOperations(
    structure as any[], 
    customInput, 
    setStructure, 
    addLogEntry, 
    setAnimationSteps, 
    setCurrentStep, 
    setIsAnimating, 
    setOperationResult, 
    setCustomInput
  );
  
  const stackOperations = useStackOperations(
    structure as any[], 
    customInput, 
    setStructure, 
    addLogEntry, 
    setAnimationSteps, 
    setCurrentStep, 
    setIsAnimating, 
    setOperationResult, 
    setCustomInput
  );
  
  const queueOperations = useQueueOperations(
    structure as any[], 
    customInput, 
    setStructure, 
    addLogEntry, 
    setAnimationSteps, 
    setCurrentStep, 
    setIsAnimating, 
    setOperationResult, 
    setCustomInput
  );
  
  const linkedListOperations = useLinkedListOperations(
    structure, 
    customInput, 
    setStructure, 
    addLogEntry, 
    setOperationResult, 
    setCustomInput
  );
  
  const handleOperation = (operation: string) => {
    try {
      switch (dataStructureId) {
        case 'array':
          if (operation === 'add') {
            arrayOperations.handleAdd();
          } else if (operation === 'remove') {
            arrayOperations.handleRemove();
          } else if (operation === 'search') {
            arrayOperations.handleSearch();
          }
          break;
          
        case 'linked-list':
          if (operation === 'add') {
            linkedListOperations.handleAdd();
          } else if (operation === 'remove') {
            linkedListOperations.handleRemove();
          } else if (operation === 'search') {
            linkedListOperations.handleSearch();
          }
          break;
          
        case 'stack':
          if (operation === 'push') {
            stackOperations.handlePush();
          } else if (operation === 'pop') {
            stackOperations.handlePop();
          } else if (operation === 'peek') {
            stackOperations.handlePeek();
          }
          break;
          
        case 'queue':
          if (operation === 'enqueue') {
            queueOperations.handleEnqueue();
          } else if (operation === 'dequeue') {
            queueOperations.handleDequeue();
          }
          break;
          
        case 'binary-tree':
          if (operation === 'insert') {
            if (!customInput) {
              addLogEntry("Please enter a value to insert");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            addLogEntry(`Inserted ${value} into the binary tree (visualization in progress)`);
            setCustomInput('');
          }
          break;
          
        case 'hash-table':
          if (operation === 'set') {
            if (!customInput) {
              addLogEntry("Please enter a key:value pair (e.g., name:John)");
              return;
            }
            addLogEntry(`Set key-value pair in hash table (visualization in progress)`);
            setCustomInput('');
          }
          break;
          
        case 'graph':
          if (operation === 'addVertex') {
            if (!customInput) {
              addLogEntry("Please enter a vertex name");
              return;
            }
            addLogEntry(`Added vertex to graph (visualization in progress)`);
            setCustomInput('');
          }
          break;
          
        default:
          addLogEntry("Operation not supported for this data structure yet");
      }
    } catch (error) {
      console.error(error);
      addLogEntry(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return { handleOperation };
};
