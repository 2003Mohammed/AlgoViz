
import React, { useRef } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { useVisualizerState } from '../../hooks/visualizer';
import { VisualizerHeader } from './VisualizerHeader';
import { ProgressTracker } from './ProgressTracker';
import { CustomArrayInput } from './CustomArrayInput';
import { ArrayVisualizer } from './array-visualizer';
import { VisualizerControls } from '../VisualizerControls';
import { VisualizerCodeSections } from './VisualizerCodeSections';
import { AlgorithmAnalysis } from './AlgorithmAnalysis';
import { RealWorldExamples } from './RealWorldExamples';
import { motion } from 'framer-motion';

interface VisualizerContainerProps {
  algorithm: Algorithm;
}

export const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ algorithm }) => {
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  const {
    array,
    graphData,
    treeData,
    visualizationType,
    isPlaying,
    currentStep,
    totalSteps,
    speed,
    activeLineIndex,
    handleGenerateRandomArray,
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    handleCustomArraySubmit,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    changeSpeed,
    exportVisualization
  } = useVisualizerState(algorithm.id);

  // Function to generate new data based on algorithm type
  const handleGenerateNewData = () => {
    if (visualizationType === 'array') {
      handleGenerateRandomArray();
    } else if (visualizationType === 'graph') {
      handleGenerateRandomGraph();
    } else if (visualizationType === 'tree') {
      handleGenerateRandomTree();
    }
  };

  return (
    <div className="space-y-8" ref={visualizerRef}>
      <motion.div 
        className="cyber-panel overflow-hidden rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.7,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        <div className="p-6">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-16 h-16 border-t-2 border-l-2 border-cyber-primary opacity-70"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-2 border-r-2 border-cyber-primary opacity-70"></div>
            
            <div className="relative z-10">
              <VisualizerHeader 
                algorithmName={algorithm.name}
                onGenerateNewArray={handleGenerateNewData}
                onExportVisualization={exportVisualization}
              />
              
              <ProgressTracker
                currentStep={currentStep}
                totalSteps={totalSteps}
                algorithmId={algorithm.id}
              />
              
              {visualizationType === 'array' && (
                <CustomArrayInput onSubmit={handleCustomArraySubmit} />
              )}
            </div>
          </div>
          
          <motion.div
            className="my-8 rounded-sm overflow-hidden cyber-grid relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ArrayVisualizer 
              array={array} 
              graphData={graphData}
              treeData={treeData}
              type={visualizationType}
              algorithmId={algorithm.id}
            />
          </motion.div>
          
          <VisualizerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onReset={reset}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onSpeedChange={changeSpeed}
            currentSpeed={speed}
            disableBackward={currentStep === 0}
            disableForward={currentStep === totalSteps - 1}
          />
          
          <div className="mt-4 text-sm text-center text-cyber-primary/80">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="cyber-panel"
      >
        <VisualizerCodeSections 
          algorithm={algorithm} 
          activeLineIndex={activeLineIndex} 
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="cyber-panel"
      >
        <RealWorldExamples algorithm={algorithm} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="cyber-panel"
      >
        <AlgorithmAnalysis algorithm={algorithm} />
      </motion.div>
    </div>
  );
};
