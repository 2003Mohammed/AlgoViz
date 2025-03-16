
import { DataStructure } from '../../utils/dataStructureData';
import { useStructureState } from './hooks/useStructureState';
import { useAnimationSteps } from './hooks/useAnimationSteps';
import { useOperationHandler } from './hooks/useOperationHandler';
import { toast } from '../../hooks/use-toast';

export const useDataStructureState = (dataStructure: DataStructure) => {
  // Initialize base state
  const {
    customInput,
    structure,
    operationResult,
    operationLog,
    animationSteps,
    currentStep,
    isAnimating,
    setCustomInput,
    setStructure,
    setOperationResult,
    setOperationLog,
    setAnimationSteps,
    setCurrentStep,
    setIsAnimating,
    resetToDefault,
    addLogEntry,
    handleInputChange
  } = useStructureState(dataStructure);
  
  // Set up animation steps
  useAnimationSteps(isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating);
  
  // Initialize operation handler
  const { handleOperation } = useOperationHandler(
    dataStructure.id,
    structure,
    customInput,
    setStructure,
    addLogEntry,
    setAnimationSteps,
    setCurrentStep,
    setIsAnimating,
    setOperationResult,
    setCustomInput
  );

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
    addLogEntry,
    setCurrentStep
  };
};
