
import React from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { motion } from 'framer-motion';
import { useDataStructureState } from './useDataStructureState';
import { OperationLog } from './OperationLog';
import { StructureRenderer } from './StructureRenderer';
import { VisualizerHeader } from './components/VisualizerHeader';
import { AnimationControls } from './components/AnimationControls';
import { InputSection } from './components/InputSection';
import { ReferenceSection } from './components/ReferenceSection';

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
    speed,
    setCustomInput,
    resetToDefault,
    handleOperation,
    handleInputChange,
    setCurrentStep,
    setIsAnimating,
    handleSpeedChange
  } = useDataStructureState(dataStructure);
  
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
        
        <AnimationControls
          currentStep={currentStep}
          animationSteps={animationSteps}
          speed={speed}
          isAnimating={isAnimating}
          setCurrentStep={setCurrentStep}
          setIsAnimating={setIsAnimating}
          onSpeedChange={handleSpeedChange}
        />
        
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
