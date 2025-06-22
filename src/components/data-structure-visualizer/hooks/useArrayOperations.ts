
import { visualizeArrayOperation } from '../../../utils/visualizations';

export const useArrayOperations = (
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
  const handleAdd = () => {
    if (!customInput.trim()) {
      addLogEntry("Please enter a value to add");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    console.log('Adding value:', value, 'to array:', structure);
    
    const steps = visualizeArrayOperation(structure, 'add', value);
    const newStructure = [...structure, value];
    
    addLogEntry(`Adding ${value} to the array`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    // Update structure immediately for immediate visual feedback
    setStructure(newStructure);
    setOperationResult(null);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handleRemove = () => {
    if (structure.length === 0) {
      addLogEntry("Array is empty - nothing to remove");
      setOperationResult(null);
      return null;
    }
    
    const steps = visualizeArrayOperation(structure, 'remove');
    const newStructure = [...structure];
    const result = newStructure.pop();
    
    addLogEntry(`Removed ${result} from the array`);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    // Update structure immediately
    setStructure(newStructure);
    setOperationResult(result);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handleSearch = () => {
    if (!customInput.trim()) {
      addLogEntry("Please enter a value to search");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const steps = visualizeArrayOperation(structure, 'search', value);
    const result = structure.indexOf(value);
    
    const message = result === -1 ? 
      `${value} not found in array` : 
      `Found ${value} at index ${result}`;
    
    addLogEntry(message);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setOperationResult(result);
    setCustomInput('');
    
    return structure;
  };
  
  return { handleAdd, handleRemove, handleSearch };
};
