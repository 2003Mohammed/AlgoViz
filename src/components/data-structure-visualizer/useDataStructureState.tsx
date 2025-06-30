
import { DataStructure } from '../../utils/dataStructureData';
import { useStructureState } from './hooks/useStructureState';
import { useAnimationSteps } from './hooks/useAnimationSteps';
import { useOperationHandler } from './hooks/useOperationHandler';
import { useCallback } from 'react';

export const useDataStructureState = (dataStructure: DataStructure) => {
  // Initialize base state (removed speed state)
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
  
  // Set up animation steps (removed speed parameter)
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

  const handleOperationWithLogging = useCallback((operation: string) => {
    console.log('Executing operation:', operation, 'on structure:', dataStructure.id);
    handleOperation(operation);
  }, [handleOperation, dataStructure.id]);

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
    handleOperation: handleOperationWithLogging,
    handleInputChange,
    addLogEntry,
    setCurrentStep,
    setIsAnimating
  };
};
