
import React, { useRef } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { useVisualizerState } from '../../hooks/useVisualizerState';
import { VisualizerHeader } from './VisualizerHeader';
import { ProgressTracker } from './ProgressTracker';
import { CustomArrayInput } from './CustomArrayInput';
import { ArrayVisualizer } from './ArrayVisualizer';
import { VisualizerControls } from '../VisualizerControls';
import { VisualizerCodeSections } from './VisualizerCodeSections';
import { AlgorithmAnalysis } from './AlgorithmAnalysis';
import { RealWorldExamples } from './RealWorldExamples';

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
      <div className="glass-card p-6">
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
        
        <ArrayVisualizer 
          array={array} 
          graphData={graphData}
          treeData={treeData}
          type={visualizationType}
          algorithmId={algorithm.id}
        />
        
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
        
        <div className="mt-6 text-sm text-center text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      <VisualizerCodeSections 
        algorithm={algorithm} 
        activeLineIndex={activeLineIndex} 
      />
      
      <RealWorldExamples algorithm={algorithm} />
      
      <AlgorithmAnalysis algorithm={algorithm} />
    </div>
  );
};
