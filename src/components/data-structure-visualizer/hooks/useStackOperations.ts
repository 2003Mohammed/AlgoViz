
import { visualizeStackOperation } from '../../../utils/visualizations';

export const useStackOperations = (
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
  const handlePush = () => {
    if (!customInput) {
      addLogEntry("Please enter a value to push");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const steps = visualizeStackOperation(structure, 'push', value);
    const newStructure = [value, ...structure];
    addLogEntry(`Pushed ${value} onto the stack`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setStructure(newStructure);
    setOperationResult(null);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handlePop = () => {
    if (structure.length === 0) {
      addLogEntry("Stack is empty");
      return null;
    }
    
    const steps = visualizeStackOperation(structure, 'pop');
    const newStructure = [...structure];
    const result = newStructure.shift();
    addLogEntry(`Popped ${result} from the stack`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setStructure(newStructure);
    setOperationResult(result);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handlePeek = () => {
    if (structure.length === 0) {
      addLogEntry("Stack is empty");
      setOperationResult(null);
      return null;
    }
    
    const steps = visualizeStackOperation(structure, 'peek');
    const result = structure[0];
    addLogEntry(`Top element is: ${result}`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setOperationResult(result);
    
    return result;
  };
  
  return { handlePush, handlePop, handlePeek };
};
