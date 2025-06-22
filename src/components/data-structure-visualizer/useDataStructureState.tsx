
import { DataStructure } from '../../utils/dataStructureData';
import { useStructureState } from './hooks/useStructureState';
import { useAnimationSteps } from './hooks/useAnimationSteps';
import { useOperationHandler } from './hooks/useOperationHandler';
import { toast } from '../../hooks/use-toast';
import { useState } from 'react';

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

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

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
    handleOperation,
    handleInputChange,
    addLogEntry,
    setCurrentStep,
    setIsAnimating,
    handleSpeedChange
  };
};
