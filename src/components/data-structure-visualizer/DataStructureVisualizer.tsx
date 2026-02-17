import React from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { useDataStructureState } from './useDataStructureState';
import { StructureRenderer } from './StructureRenderer';
import { VisualizerHeader } from './components/VisualizerHeader';
import { InputSection } from './components/InputSection';
import { AnimationControls } from './components/AnimationControls';
import { OperationsInfo } from './OperationsInfo';
import { ImplementationCode } from './ImplementationCode';
import { ReferenceSection } from './components/ReferenceSection';
import { RealWorldApplications } from './components/RealWorldApplications';
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
    animationSteps,
    currentStep,
    isAnimating,
    setCustomInput,
    resetToDefault,
    generateRandomExample,
    handleOperation,
    handleInputChange,
    treeMode,
    setTreeMode,
    setCurrentStep,
    setIsAnimating,
    speed,
    setSpeed,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    resetAnimation
  } = useDataStructureState(dataStructure);

  return (
    <div className="space-y-8">
      {/* Header */}
      <VisualizerHeader 
        dataStructureName={dataStructure.name}
        onReset={resetToDefault}
        onGenerateExample={generateRandomExample}
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
            handleInputChange={handleInputChange}
            handleOperation={handleOperation}
            treeMode={treeMode}
            onTreeModeChange={setTreeMode}
          />
          
          {animationSteps.length > 0 && ['array', 'binary-tree', 'graph'].includes(dataStructure.id) && (
            <AnimationControls
              isAnimating={isAnimating}
              currentStep={currentStep}
              animationSteps={animationSteps}
              speed={speed}
              setCurrentStep={setCurrentStep}
              setIsAnimating={setIsAnimating}
              onSpeedChange={setSpeed}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onJumpToStart={jumpToStart}
              onJumpToEnd={jumpToEnd}
              onReset={resetAnimation}
            />
          )}
        </div>

        {/* Right Column - Logs and Info */}
        <div className="space-y-4">
          <OperationsInfo 
            operations={dataStructure.operations || []}
          />
        </div>
      </div>

      {/* Real World Applications */}
      <RealWorldApplications dataStructure={dataStructure} />

      <div className="cyber-panel p-4">
        <h3 className="text-lg font-semibold mb-2">Learn More Resources</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href={`https://www.w3schools.com/search/search.php?query=${dataStructure.name}`} target="_blank" rel="noopener noreferrer" className="underline">W3Schools</a>
          <a href={`https://www.geeksforgeeks.org/search/?q=${dataStructure.name}`} target="_blank" rel="noopener noreferrer" className="underline">GeeksforGeeks</a>
          <a href={`https://www.javatpoint.com/search?query=${dataStructure.name}`} target="_blank" rel="noopener noreferrer" className="underline">Javatpoint</a>
        </div>
      </div>

      {/* Code and Reference */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ImplementationCode 
          code={dataStructure.implementation || ''}
        />
        <ReferenceSection 
          dataStructure={dataStructure}
        />
      </div>
    </div>
  );
};
