
import React, { useEffect, useState } from 'react';
import { useBinarySearch } from '../hooks/visualizer/useBinarySearch';
import { ArrayVisualization } from '../components/visualizer/array-visualizer/ArrayVisualization';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrayAnimationControls } from '../components/visualizer/array-visualizer/ArrayAnimationControls';
import { Search, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

export const BinarySearchPage: React.FC = () => {
  const {
    array,
    steps,
    currentStep,
    isAnimating,
    setArray,
    setCurrentStep,
    setIsAnimating,
    generateSortedArray,
    binarySearch
  } = useBinarySearch();

  const [searchValue, setSearchValue] = useState('');

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
        }, 2000);
      }
    }, 2000); // Slower for binary search to show the logic

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps, setCurrentStep, setArray, setIsAnimating]);

  const handleSearch = () => {
    const value = parseInt(searchValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid number to search');
      return;
    }
    
    binarySearch(value);
    setSearchValue('');
  };

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
        <h1 className="text-4xl font-bold mb-2">Binary Search Visualizer</h1>
        <p className="text-muted-foreground">
          Watch how binary search efficiently finds elements in sorted arrays
        </p>
      </motion.div>

      {/* Algorithm Explanation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-muted/20 border rounded-lg p-4"
      >
        <h3 className="font-semibold mb-2">How Binary Search Works:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Compare target with middle element</li>
          <li>• If equal, found! If target is smaller, search left half</li>
          <li>• If target is larger, search right half</li>
          <li>• Repeat until found or search space is empty</li>
          <li>• Time Complexity: O(log n)</li>
        </ul>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter number to search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="number"
              />
              <Button onClick={handleSearch} disabled={isAnimating}>
                Search
              </Button>
            </div>
            <Button onClick={generateSortedArray} disabled={isAnimating} variant="outline" className="w-full">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate New Sorted Array
            </Button>
          </CardContent>
        </Card>

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
  );
};
