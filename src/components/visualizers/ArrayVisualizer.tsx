
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Play, Pause, RotateCcw, StepForward, StepBack, Shuffle, Plus, Minus, Search } from 'lucide-react';
import { useAnimationControls } from '../../hooks/useAnimationControls';
import { useVisualizationSteps, VisualizationStep } from '../../hooks/useVisualizationSteps';
import { toast } from '../../hooks/use-toast';

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'found' | 'active';
}

const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' },
    { value: 11, status: 'default' },
    { value: 90, status: 'default' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection'>('bubble');

  const visualization = useVisualizationSteps(array);
  const controls = useAnimationControls(visualization.totalSteps);

  // Animation effect
  useEffect(() => {
    if (controls.isPlaying && controls.currentStep < visualization.totalSteps - 1) {
      const timeout = setTimeout(() => {
        controls.setCurrentStep(controls.currentStep + 1);
      }, 1000 / controls.speed);
      
      controls.animationRef.current = timeout;
      return () => clearTimeout(timeout);
    } else if (controls.currentStep >= visualization.totalSteps - 1) {
      controls.pause();
    }
  }, [controls.isPlaying, controls.currentStep, controls.speed, visualization.totalSteps]);

  // Update array based on current step
  useEffect(() => {
    const currentStep = visualization.getCurrentStep(controls.currentStep);
    if (currentStep) {
      setArray(currentStep.data);
    }
  }, [controls.currentStep, visualization]);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: 8 }, () => ({
      value: Math.floor(Math.random() * 100) + 1,
      status: 'default' as const
    }));
    setArray(newArray);
    visualization.clearSteps();
    controls.reset();
    toast({ title: 'Random array generated' });
  }, [visualization, controls]);

  const insertAtIndex = useCallback(() => {
    const value = parseInt(inputValue);
    const index = insertIndex ? parseInt(insertIndex) : array.length;
    
    if (isNaN(value)) {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return;
    }
    
    if (index < 0 || index > array.length) {
      toast({ title: 'Error', description: 'Invalid index', variant: 'destructive' });
      return;
    }

    const newArray = [...array];
    newArray.splice(index, 0, { value, status: 'default' });
    setArray(newArray);
    setInputValue('');
    setInsertIndex('');
    visualization.clearSteps();
    controls.reset();
    toast({ title: 'Element inserted', description: `Added ${value} at index ${index}` });
  }, [inputValue, insertIndex, array, visualization, controls]);

  const deleteAtIndex = useCallback(() => {
    const index = parseInt(deleteIndex);
    
    if (isNaN(index) || index < 0 || index >= array.length) {
      toast({ title: 'Error', description: 'Invalid index', variant: 'destructive' });
      return;
    }

    const newArray = [...array];
    const removedValue = newArray[index].value;
    newArray.splice(index, 1);
    setArray(newArray);
    setDeleteIndex('');
    visualization.clearSteps();
    controls.reset();
    toast({ title: 'Element deleted', description: `Removed ${removedValue} from index ${index}` });
  }, [deleteIndex, array, visualization, controls]);

  const searchElement = useCallback(() => {
    const value = parseInt(searchValue);
    
    if (isNaN(value)) {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    
    for (let i = 0; i < array.length; i++) {
      const stepArray = array.map((item, idx) => ({
        ...item,
        status: idx === i ? 'active' : idx < i ? 'comparing' : 'default' 
      }));
      
      steps.push({
        data: stepArray,
        description: `Checking index ${i}: ${array[i].value}`,
        activeIndex: i
      });
      
      if (array[i].value === value) {
        const foundArray = array.map((item, idx) => ({
          ...item,
          status: idx === i ? 'found' : 'default'
        }));
        
        steps.push({
          data: foundArray,
          description: `Found ${value} at index ${i}!`,
          activeIndex: i
        });
        break;
      }
    }
    
    if (!array.some(item => item.value === value)) {
      steps.push({
        data: array.map(item => ({ ...item, status: 'comparing' })),
        description: `${value} not found in array`
      });
    }

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    setSearchValue('');
    toast({ title: 'Search started', description: `Searching for ${value}` });
  }, [searchValue, array, visualization, controls]);

  const bubbleSort = useCallback(() => {
    visualization.clearSteps();
    const arr = [...array];
    const steps: VisualizationStep[] = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Show comparison
        const compareArray = arr.map((item, idx) => ({
          ...item,
          status: (idx === j || idx === j + 1) ? 'comparing' : 
                  idx >= arr.length - i ? 'sorted' : 'default'
        }));
        
        steps.push({
          data: compareArray,
          description: `Comparing ${arr[j].value} and ${arr[j + 1].value}`,
          compareIndices: [j, j + 1]
        });
        
        visualization.incrementComparisons();
        
        if (arr[j].value > arr[j + 1].value) {
          // Show swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          
          const swapArray = arr.map((item, idx) => ({
            ...item,
            status: (idx === j || idx === j + 1) ? 'swapping' : 
                    idx >= arr.length - i ? 'sorted' : 'default'
          }));
          
          steps.push({
            data: swapArray,
            description: `Swapped ${arr[j + 1].value} and ${arr[j].value}`,
            swapIndices: [j, j + 1]
          });
          
          visualization.incrementSwaps();
        }
      }
      
      // Mark as sorted
      const sortedArray = arr.map((item, idx) => ({
        ...item,
        status: idx >= arr.length - i - 1 ? 'sorted' : 'default'
      }));
      
      steps.push({
        data: sortedArray,
        description: `Element at position ${arr.length - i - 1} is now in correct position`
      });
    }
    
    // Final sorted state
    steps.push({
      data: arr.map(item => ({ ...item, status: 'sorted' })),
      description: 'Array is completely sorted!'
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    toast({ title: 'Bubble sort started', description: 'Watch the sorting animation' });
  }, [array, visualization, controls]);

  const selectionSort = useCallback(() => {
    visualization.clearSteps();
    const arr = [...array];
    const steps: VisualizationStep[] = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      
      // Show current minimum
      const currentArray = arr.map((item, idx) => ({
        ...item,
        status: idx < i ? 'sorted' : idx === minIndex ? 'active' : 'default'
      }));
      
      steps.push({
        data: currentArray,
        description: `Finding minimum from index ${i} onwards`,
        activeIndex: minIndex
      });
      
      for (let j = i + 1; j < arr.length; j++) {
        // Show comparison
        const compareArray = arr.map((item, idx) => ({
          ...item,
          status: idx < i ? 'sorted' : 
                  idx === minIndex ? 'active' : 
                  idx === j ? 'comparing' : 'default'
        }));
        
        steps.push({
          data: compareArray,
          description: `Comparing ${arr[minIndex].value} with ${arr[j].value}`,
          compareIndices: [minIndex, j]
        });
        
        visualization.incrementComparisons();
        
        if (arr[j].value < arr[minIndex].value) {
          minIndex = j;
        }
      }
      
      // Swap if needed
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        
        const swapArray = arr.map((item, idx) => ({
          ...item,
          status: idx === i || idx === minIndex ? 'swapping' : 
                  idx < i ? 'sorted' : 'default'
        }));
        
        steps.push({
          data: swapArray,
          description: `Swapped ${arr[minIndex].value} with ${arr[i].value}`,
          swapIndices: [i, minIndex]
        });
        
        visualization.incrementSwaps();
      }
      
      // Mark as sorted
      const sortedArray = arr.map((item, idx) => ({
        ...item,
        status: idx <= i ? 'sorted' : 'default'
      }));
      
      steps.push({
        data: sortedArray,
        description: `Position ${i} is now sorted`
      });
    }
    
    // Final sorted state
    steps.push({
      data: arr.map(item => ({ ...item, status: 'sorted' })),
      description: 'Selection sort complete!'
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    toast({ title: 'Selection sort started', description: 'Watch the sorting animation' });
  }, [array, visualization, controls]);

  const startSorting = useCallback(() => {
    if (algorithm === 'bubble') {
      bubbleSort();
    } else {
      selectionSort();
    }
  }, [algorithm, bubbleSort, selectionSort]);

  const maxValue = Math.max(...array.map(item => item.value));
  const currentStep = visualization.getCurrentStep(controls.currentStep);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Array Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Array Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Element</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                />
                <Input
                  placeholder="Index (optional)"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  type="number"
                />
                <Button onClick={insertAtIndex} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Element</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Index"
                  value={deleteIndex}
                  onChange={(e) => setDeleteIndex(e.target.value)}
                  type="number"
                />
                <Button onClick={deleteAtIndex} size="sm" variant="destructive">
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Element</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="number"
                />
                <Button onClick={searchElement} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-end justify-center gap-2">
            <AnimatePresence mode="sync">
              {array.map((item, index) => {
                const height = (item.value / maxValue) * 200;
                const getColor = () => {
                  switch (item.status) {
                    case 'comparing': return 'bg-yellow-500';
                    case 'swapping': return 'bg-blue-500';
                    case 'sorted': return 'bg-green-500';
                    case 'found': return 'bg-purple-500';
                    case 'active': return 'bg-orange-500';
                    default: return 'bg-primary';
                  }
                };

                return (
                  <motion.div
                    key={`${index}-${item.value}`}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <motion.div
                      className={`${getColor()} rounded-t-lg flex items-end justify-center text-white text-sm font-bold min-w-[40px] relative`}
                      style={{ height: `${Math.max(height, 30)}px` }}
                      animate={{
                        scale: item.status === 'comparing' || item.status === 'swapping' ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="mb-1">{item.value}</span>
                      {(item.status === 'comparing' || item.status === 'swapping') && (
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-t-lg"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {index}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Algorithm Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Sort Algorithm:</label>
            <div className="flex gap-2">
              <Button
                variant={algorithm === 'bubble' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm('bubble')}
              >
                Bubble Sort
              </Button>
              <Button
                variant={algorithm === 'selection' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm('selection')}
              >
                Selection Sort
              </Button>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Array
            </Button>
            <Button onClick={startSorting} variant="default" size="sm">
              Start {algorithm === 'bubble' ? 'Bubble' : 'Selection'} Sort
            </Button>
            <Button onClick={controls.stepBackward} variant="outline" size="sm" disabled={controls.currentStep === 0}>
              <StepBack className="h-4 w-4" />
            </Button>
            <Button onClick={controls.isPlaying ? controls.pause : controls.play} variant="outline" size="sm">
              {controls.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={controls.stepForward} variant="outline" size="sm" disabled={controls.currentStep >= visualization.totalSteps - 1}>
              <StepForward className="h-4 w-4" />
            </Button>
            <Button onClick={controls.reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Speed:</span>
            <div className="flex-1 max-w-xs">
              <Slider
                value={[controls.speed]}
                onValueChange={(value) => controls.setSpeed(value[0])}
                min={0.25}
                max={4}
                step={0.25}
              />
            </div>
            <span className="text-sm text-muted-foreground">{controls.speed}x</span>
          </div>
          
          {/* Step Info */}
          {visualization.totalSteps > 0 && (
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Step {controls.currentStep + 1} of {visualization.totalSteps}
                </span>
                <div className="text-sm text-muted-foreground">
                  Operations: {visualization.operationCount} | 
                  Comparisons: {visualization.comparisons} | 
                  Swaps: {visualization.swaps}
                </div>
              </div>
              {currentStep && (
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Arrays are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Database indexing and searching</li>
                <li>• Image and video processing (pixel arrays)</li>
                <li>• Mathematical computations and matrices</li>
                <li>• Game development (tile maps, inventories)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sorting algorithms in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Search engines (relevance ranking)</li>
                <li>• E-commerce (price, rating sorting)</li>
                <li>• Data analysis and reporting</li>
                <li>• File system organization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning References */}
      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.w3schools.com/dsa/dsa_data_arrays.php" target="_blank" rel="noopener noreferrer">
                W3Schools - Arrays
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" rel="noopener noreferrer">
                MDN - Array Methods
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.geeksforgeeks.org/array-data-structure/" target="_blank" rel="noopener noreferrer">
                GeeksforGeeks - Arrays
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArrayVisualizer;
