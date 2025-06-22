
import { DataStructure } from '../../utils/dataStructureData';
import { useStructureState } from './hooks/useStructureState';
import { useAnimationSteps } from './hooks/useAnimationSteps';
import { useOperationHandler } from './hooks/useOperationHandler';
import { useState, useCallback } from 'react';

export const useDataStructureState = (dataStructure: DataStructure) => {
  const [speed, setSpeed] = useState(1);
  
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
  
  // Set up animation steps with speed
  useAnimationSteps(isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating, speed);
  
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

  const handleSpeedChange = useCallback((value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    console.log('Speed changed to:', newSpeed);
  }, []);

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
    speed,
    setCustomInput,
    resetToDefault,
    handleOperation: handleOperationWithLogging,
    handleInputChange,
    addLogEntry,
    setCurrentStep,
    setIsAnimating,
    handleSpeedChange
  };
};
