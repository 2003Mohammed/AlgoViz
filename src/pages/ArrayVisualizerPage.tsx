
import React, { useEffect } from 'react';
import { useArrayVisualization } from '../hooks/visualizer/useArrayVisualization';
import { ArrayVisualization } from '../components/visualizer/array-visualizer/ArrayVisualization';
import { ArrayControls } from '../components/visualizer/array-visualizer/ArrayControls';
import { ArrayAnimationControls } from '../components/visualizer/array-visualizer/ArrayAnimationControls';
import { motion } from 'framer-motion';

export const ArrayVisualizerPage: React.FC = () => {
  const {
    array,
    steps,
    currentStep,
    isAnimating,
    setArray,
    setCurrentStep,
    setIsAnimating,
    generateRandomArray,
    insertElement,
    deleteElement,
    searchElement,
    bubbleSort,
    selectionSort
  } = useArrayVisualization();

  // Auto-advance animation
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setArray(steps[nextStep].array);
      } else {
        setIsAnimating(false);
        setTimeout(() => {
          setArray(steps[steps.length - 1].array.map(item => ({ ...item, status: 'default' })));
        }, 1000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps, setCurrentStep, setArray, setIsAnimating]);

  const handlePlay = () => {
    if (steps.length > 0) {
      setIsAnimating(true);
    }
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    if (steps.length > 0) {
      setArray(steps[0].array);
    }
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setArray(steps[nextStep].array);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setArray(steps[prevStep].array);
    }
  };

  const currentDescription = steps[currentStep]?.description || '';

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">Array Visualizer</h1>
        <p className="text-muted-foreground">
          Interactive visualization of array operations and sorting algorithms
        </p>
      </motion.div>

      {/* Main Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background border rounded-lg p-6"
      >
        <ArrayVisualization array={array} />
        
        {currentDescription && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-center">
            <p className="text-sm font-medium">{currentDescription}</p>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArrayControls
            onInsert={insertElement}
            onDelete={deleteElement}
            onSearch={searchElement}
            onBubbleSort={bubbleSort}
            onSelectionSort={selectionSort}
            onGenerateRandom={generateRandomArray}
            isAnimating={isAnimating}
          />
        </div>
        <div>
          <ArrayAnimationControls
            isAnimating={isAnimating}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
          />
        </div>
      </div>
    </div>
  );
};
