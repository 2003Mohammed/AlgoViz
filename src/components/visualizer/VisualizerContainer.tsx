
import React, { useRef } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { useVisualizerState } from '../../hooks/visualizer';
import { VisualizerHeader } from './VisualizerHeader';
import { ProgressTracker } from './ProgressTracker';
import { CustomArrayInput } from './CustomArrayInput';
import { ArrayVisualizer } from './ArrayVisualizer';
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
    <div className="space-y-6" ref={visualizerRef}>
      <motion.div 
        className="rounded-lg overflow-hidden tech-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        <div className="backdrop-blur-sm p-6 border border-blue-500/20">
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
          
          <motion.div
            className="my-6 rounded-lg overflow-hidden glow-effect digital-rain"
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
          
          <div className="mt-6 text-sm text-center text-blue-300">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-card"
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
        className="glass-card"
      >
        <RealWorldExamples algorithm={algorithm} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card"
      >
        <AlgorithmAnalysis algorithm={algorithm} />
      </motion.div>
    </div>
  );
};
