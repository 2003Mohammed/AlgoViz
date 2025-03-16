
import { visualizeQueueOperation } from '../../../utils/visualizations';

export const useQueueOperations = (
  structure: any[],
  customInput: string,
  setStructure: React.Dispatch<React.SetStateAction<any>>,
  addLogEntry: (message: string) => void,
  setAnimationSteps: React.Dispatch<React.SetStateAction<any[]>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>,
  setOperationResult: React.Dispatch<React.SetStateAction<any>>,
  setCustomInput: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleEnqueue = () => {
    if (!customInput) {
      addLogEntry("Please enter a value to enqueue");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const steps = visualizeQueueOperation(structure, 'enqueue', value);
    const newStructure = [...structure, value];
    addLogEntry(`Enqueued ${value} to the queue`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setStructure(newStructure);
    setOperationResult(null);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handleDequeue = () => {
    if (structure.length === 0) {
      addLogEntry("Queue is empty");
      return null;
    }
    
    const steps = visualizeQueueOperation(structure, 'dequeue');
    const newStructure = [...structure];
    const result = newStructure.shift();
    addLogEntry(`Dequeued ${result} from the queue`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setStructure(newStructure);
    setOperationResult(result);
    setCustomInput('');
    
    return newStructure;
  };
  
  return { handleEnqueue, handleDequeue };
};
