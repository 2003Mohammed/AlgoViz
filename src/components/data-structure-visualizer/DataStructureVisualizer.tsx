
import React, { useState } from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Info, PlusCircle, MinusCircle, RotateCcw, Play, Pause, StepForward, StepBack } from 'lucide-react';
import { OperationControls } from './OperationControls';
import { OperationLog } from './OperationLog';
import { StructureRenderer } from './StructureRenderer';
import { OperationsInfo } from './OperationsInfo';
import { ImplementationCode } from './ImplementationCode';
import { useDataStructureState } from './useDataStructureState';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';

interface DataStructureVisualizerProps {
  dataStructure: DataStructure;
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({ dataStructure }) => {
  const {
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
    setCurrentStep
  } = useDataStructureState(dataStructure);
  
  const [speed, setSpeed] = useState(1);
  
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="glass-card p-6 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            className="text-xl font-semibold relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="relative z-10">{dataStructure.name} Visualization</span>
            <motion.div 
              className="absolute -bottom-2 left-0 h-2 bg-primary/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h3>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          >
            <Button 
              onClick={resetToDefault}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="relative min-h-64 flex flex-col items-center justify-center gap-6 mb-6 perspective-1000"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StructureRenderer 
            structure={structure} 
            dataStructureId={dataStructure.id} 
            animationStep={animationSteps[currentStep]}
            currentStep={currentStep}
          />
        </motion.div>
        
        {animationSteps.length > 0 && (
          <motion.div 
            className="mb-6 space-y-3 py-2 px-4 bg-muted/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {animationSteps.length}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8"
                  disabled={currentStep <= 0}
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                >
                  <StepBack className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8"
                  disabled={currentStep >= animationSteps.length - 1}
                  onClick={() => setCurrentStep(Math.min(animationSteps.length - 1, currentStep + 1))}
                >
                  <StepForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">Speed:</span>
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.5}
                onValueChange={handleSpeedChange}
                className="w-32"
              />
              <span className="text-xs">{speed}x</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(currentStep / (animationSteps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Enter a value..."
              value={customInput}
              onChange={handleInputChange}
              className="min-w-[200px]"
            />
          </div>
          
          <OperationControls 
            dataStructureId={dataStructure.id} 
            handleOperation={handleOperation} 
          />
        </motion.div>
        
        {operationLog.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OperationLog logs={operationLog} />
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <OperationsInfo operations={dataStructure.operations} />
      </motion.div>
      
      {dataStructure.implementation && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ImplementationCode code={dataStructure.implementation} />
        </motion.div>
      )}
    </div>
  );
};
