
import React from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { motion } from 'framer-motion';
import { useDataStructureState } from './useDataStructureState';
import { OperationLog } from './OperationLog';
import { StructureRenderer } from './StructureRenderer';
import { VisualizerHeader } from './components/VisualizerHeader';
import { InputSection } from './components/InputSection';
import { ReferenceSection } from './components/ReferenceSection';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

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
    setCurrentStep,
    setIsAnimating
  } = useDataStructureState(dataStructure);
  
  const handleStepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="glass-card p-6 overflow-hidden circuit-pattern"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <VisualizerHeader 
          dataStructureName={dataStructure.name}
          onReset={resetToDefault}
        />
        
        <motion.div 
          className="relative min-h-64 flex flex-col items-center justify-center gap-6 mb-6 perspective-1000 pixel-box rounded-lg"
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
        
        {/* Simple Animation Controls */}
        {animationSteps.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              onClick={handleStepBackward}
              disabled={currentStep === 0 || isAnimating}
              variant="outline"
              size="sm"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={toggleAnimation}
              disabled={animationSteps.length === 0}
              variant="default"
              size="sm"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={handleStepForward}
              disabled={currentStep === animationSteps.length - 1 || isAnimating}
              variant="outline"
              size="sm"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => {
                setCurrentStep(0);
                setIsAnimating(false);
              }}
              variant="ghost"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground ml-2">
              Step {currentStep + 1} of {animationSteps.length}
            </span>
          </div>
        )}
        
        <InputSection
          customInput={customInput}
          dataStructureId={dataStructure.id}
          handleInputChange={handleInputChange}
          handleOperation={handleOperation}
        />
        
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
      
      <ReferenceSection dataStructure={dataStructure} />
    </div>
  );
};
