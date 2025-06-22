
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
            
            // Simple binary tree insertion
            const newStructure = { ...structure };
            if (newStructure.nodes.length === 0) {
              newStructure.nodes = [{ value, left: null, right: null }];
              newStructure.root = 0;
            } else {
              // Add to the first available position for simplicity
              newStructure.nodes.push({ value, left: null, right: null });
            }
            
            setStructure(newStructure);
            addLogEntry(`Inserted ${value} into the binary tree`);
            setCustomInput('');
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
            const found = structure.nodes.some((node: any) => node.value === value);
            addLogEntry(`Search result: ${found ? 'Found' : 'Not found'}`);
            setOperationResult(found);
            setCustomInput('');
          }
          break;
          
        case 'hash-table':
          if (operation === 'set') {
            if (!customInput || !customInput.includes(':')) {
              addLogEntry("Please enter a key:value pair (e.g., name:John)");
              return;
            }
            const [key, value] = customInput.split(':');
            addLogEntry(`Set ${key} = ${value} in hash table`);
            setCustomInput('');
          } else if (operation === 'get') {
            if (!customInput) {
              addLogEntry("Please enter a key to search");
              return;
            }
            addLogEntry(`Searching for key: ${customInput}`);
            setCustomInput('');
          }
          break;
          
        case 'graph':
          if (operation === 'addVertex') {
            if (!customInput) {
              addLogEntry("Please enter a vertex name");
              return;
            }
            const newStructure = { ...structure };
            newStructure.nodes.push({ id: customInput, x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 });
            setStructure(newStructure);
            addLogEntry(`Added vertex: ${customInput}`);
            setCustomInput('');
          } else if (operation === 'addEdge') {
            if (!customInput || !customInput.includes('-')) {
              addLogEntry("Please enter edge as: vertex1-vertex2");
              return;
            }
            const [source, target] = customInput.split('-');
            const newStructure = { ...structure };
            newStructure.edges.push({ source: source.trim(), target: target.trim() });
            setStructure(newStructure);
            addLogEntry(`Added edge: ${source} → ${target}`);
            setCustomInput('');
          }
          break;
          
        default:
          addLogEntry("Operation not supported for this data structure");
      }
    } catch (error) {
      console.error(error);
      addLogEntry(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return { handleOperation };
};
