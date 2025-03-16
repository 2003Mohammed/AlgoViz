
import { useState, useEffect } from 'react';
import { DataStructure } from '../../../utils/dataStructureData';
import { VisualizationStep } from '../../../types/visualizer';
import { toast } from '../../../hooks/use-toast';

export const useStructureState = (dataStructure: DataStructure) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [animationSteps, setAnimationSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
  }, [dataStructure.id]);
  
  const resetToDefault = () => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
  };
  
  const addLogEntry = (message: string) => {
    setOperationLog(prev => [...prev, message]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  return {
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
  };
};
