
import React from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { useDataStructureState } from './useDataStructureState';
import { StructureRenderer } from './StructureRenderer';
import { VisualizerHeader } from './components/VisualizerHeader';
import { InputSection } from './components/InputSection';
import { AnimationControls } from './components/AnimationControls';
import { OperationLog } from './OperationLog';
import { OperationsInfo } from './OperationsInfo';
import { ImplementationCode } from './ImplementationCode';
import { ReferenceSection } from './components/ReferenceSection';
import { motion } from 'framer-motion';

export interface DataStructureVisualizerProps {
  dataStructure: DataStructure;
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({ 
  dataStructure 
}) => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <VisualizerHeader 
        title={`${dataStructure.name} Visualizer`}
        onReset={resetToDefault}
      />

      {/* Main Visualization Area */}
      <motion.div
        className="cyber-panel min-h-[400px] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StructureRenderer 
          structure={structure}
          dataStructureId={dataStructure.id}
          animationStep={animationSteps[currentStep]}
          currentStep={currentStep}
        />
      </motion.div>

      {/* Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Operations */}
        <div className="space-y-4">
          <InputSection
            dataStructureId={dataStructure.id}
            customInput={customInput}
            onInputChange={handleInputChange}
            onOperation={handleOperation}
          />
          
          <AnimationControls
            isAnimating={isAnimating}
            currentStep={currentStep}
            totalSteps={animationSteps.length}
            onPlay={() => setIsAnimating(true)}
            onPause={() => setIsAnimating(false)}
            onReset={() => {
              setCurrentStep(0);
              setIsAnimating(false);
            }}
            onStepChange={setCurrentStep}
          />
        </div>

        {/* Right Column - Logs and Info */}
        <div className="space-y-4">
          <OperationLog 
            logs={operationLog}
            operationResult={operationResult}
          />
          
          <OperationsInfo dataStructure={dataStructure} />
        </div>
      </div>

      {/* Code and Reference */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ImplementationCode dataStructure={dataStructure} />
        <ReferenceSection dataStructure={dataStructure} />
      </div>
    </div>
  );
};
