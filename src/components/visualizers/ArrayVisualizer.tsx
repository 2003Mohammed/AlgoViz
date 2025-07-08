
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
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'found' | 'active' | 'searching';
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
  const [isRunning, setIsRunning] = useState(false);

  const visualization = useVisualizationSteps(array);
  const controls = useAnimationControls(visualization.totalSteps);

  // Animation effect
  useEffect(() => {
    if (controls.isPlaying && controls.currentStep < visualization.totalSteps - 1 && !isRunning) {
      const timeout = setTimeout(() => {
        controls.setCurrentStep(controls.currentStep + 1);
      }, 1000 / controls.speed);
      
      controls.animationRef.current = timeout;
      return () => clearTimeout(timeout);
    } else if (controls.currentStep >= visualization.totalSteps - 1) {
      controls.pause();
      setIsRunning(false);
    }
  }, [controls.isPlaying, controls.currentStep, controls.speed, visualization.totalSteps, isRunning]);

  // Update array based on current step
  useEffect(() => {
    const currentStep = visualization.getCurrentStep(controls.currentStep);
    if (currentStep && controls.isPlaying) {
      setArray(currentStep.data);
    }
  }, [controls.currentStep, visualization, controls.isPlaying]);

  const validateIndex = (index: number, allowEnd: boolean = false): boolean => {
    return index >= 0 && index <= (allowEnd ? array.length : array.length - 1);
  };

  const validateValue = (value: string): number | null => {
    const num = parseInt(value);
    if (isNaN(num) || value.trim() === '') {
      toast({ title: 'Error', description: 'Please enter a valid number', variant: 'destructive' });
      return null;
    }
    if (num < 1 || num > 100) {
      toast({ title: 'Error', description: 'Please enter a number between 1 and 100', variant: 'destructive' });
      return null;
    }
    return num;
  };

  const generateRandomArray = useCallback(() => {
    if (isRunning) return;
    
    const newArray = Array.from({ length: 8 }, () => ({
      value: Math.floor(Math.random() * 100) + 1,
      status: 'default' as const
    }));
    setArray(newArray);
    visualization.clearSteps();
    controls.reset();
    toast({ title: 'Random array generated', description: `Generated ${newArray.length} random elements` });
  }, [visualization, controls, isRunning]);

  const insertAtIndex = useCallback(() => {
    if (isRunning) return;
    
    const value = validateValue(inputValue);
    if (value === null) return;
    
    const index = insertIndex ? parseInt(insertIndex) : array.length;
    
    if (isNaN(index) || !validateIndex(index, true)) {
      toast({ 
        title: 'Error', 
        description: `Index must be between 0 and ${array.length}`, 
        variant: 'destructive' 
      });
      return;
    }

    if (array.length >= 12) {
      toast({ title: 'Error', description: 'Array cannot exceed 12 elements', variant: 'destructive' });
      return;
    }

    const steps: VisualizationStep[] = [];
    
    // Step 1: Highlight insertion point
    if (index < array.length) {
      steps.push({
        data: array.map((item, i) => ({
          ...item,
          status: i === index ? 'active' as const : 'default' as const
        })),
        description: `Preparing to insert ${value} at index ${index}`
      });
    }

    // Step 2: Insert element
    const newArray = [...array];
    newArray.splice(index, 0, { value, status: 'active' });
    
    steps.push({
      data: newArray,
      description: `Inserted ${value} at index ${index}`
    });

    // Step 3: Reset status
    steps.push({
      data: newArray.map(item => ({ ...item, status: 'default' })),
      description: 'Insertion complete'
    });

    steps.forEach(step => visualization.addStep(step));
    setArray(newArray.map(item => ({ ...item, status: 'default' })));
    visualization.clearSteps();
    controls.reset();
    setInputValue('');
    setInsertIndex('');
    
    toast({ 
      title: 'Element inserted', 
      description: `Added ${value} at index ${index}. Array length: ${newArray.length}` 
    });
  }, [inputValue, insertIndex, array, visualization, controls, isRunning]);

  const deleteAtIndex = useCallback(() => {
    if (isRunning) return;
    
    const index = parseInt(deleteIndex);
    
    if (isNaN(index) || !validateIndex(index)) {
      toast({ 
        title: 'Error', 
        description: `Index must be between 0 and ${array.length - 1}`, 
        variant: 'destructive' 
      });
      return;
    }

    if (array.length === 0) {
      toast({ title: 'Error', description: 'Array is empty', variant: 'destructive' });
      return;
    }

    const steps: VisualizationStep[] = [];
    const elementToDelete = array[index].value;
    
    // Step 1: Highlight element to delete
    steps.push({
      data: array.map((item, i) => ({
        ...item,
        status: i === index ? 'active' as const : 'default' as const
      })),
      description: `Marking element ${elementToDelete} at index ${index} for deletion`
    });

    // Step 2: Remove element
    const newArray = array.filter((_, i) => i !== index);
    
    steps.push({
      data: newArray,
      description: `Deleted element ${elementToDelete} from index ${index}`
    });

    steps.forEach(step => visualization.addStep(step));
    setArray(newArray);
    visualization.clearSteps();
    controls.reset();
    setDeleteIndex('');
    
    toast({ 
      title: 'Element deleted', 
      description: `Removed ${elementToDelete} from index ${index}. Array length: ${newArray.length}` 
    });
  }, [deleteIndex, array, visualization, controls, isRunning]);

  const searchElement = useCallback(() => {
    if (isRunning) return;
    
    const value = validateValue(searchValue);
    if (value === null) return;

    if (array.length === 0) {
      toast({ title: 'Error', description: 'Array is empty', variant: 'destructive' });
      return;
    }

    visualization.clearSteps();
    const steps: VisualizationStep[] = [];
    setIsRunning(true);
    
    let found = false;
    let foundIndex = -1;
    
    for (let i = 0; i < array.length; i++) {
      // Step: Check current element
      steps.push({
        data: array.map((item, idx) => ({
          ...item,
          status: idx === i ? 'searching' as const : 
                  idx < i ? 'active' as const : 'default' as const
        })),
        description: `Checking index ${i}: value ${array[i].value} ${array[i].value === value ? '(MATCH!)' : ''}`
      });
      
      if (array[i].value === value) {
        // Found the element
        steps.push({
          data: array.map((item, idx) => ({
            ...item,
            status: idx === i ? 'found' as const : 'default' as const
          })),
          description: `Found ${value} at index ${i}!`
        });
        found = true;
        foundIndex = i;
        break;
      }
    }
    
    // If not found
    if (!found) {
      steps.push({
        data: array.map(item => ({ ...item, status: 'active' })),
        description: `${value} not found in array`
      });
      
      steps.push({
        data: array.map(item => ({ ...item, status: 'default' })),
        description: 'Search complete - element not found'
      });
    }

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    setSearchValue('');
    
    setTimeout(() => setIsRunning(false), 100);
    
    const message = found ? `Found ${value} at index ${foundIndex}` : `${value} not found`;
    toast({ title: 'Search completed', description: message });
  }, [searchValue, array, visualization, controls, isRunning]);

  const bubbleSort = useCallback(() => {
    if (isRunning || array.length === 0) return;
    
    visualization.clearSteps();
    const arr = [...array];
    const steps: VisualizationStep[] = [];
    setIsRunning(true);
    
    let swaps = 0;
    let comparisons = 0;
    
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        
        // Show comparison
        steps.push({
          data: arr.map((item, idx) => ({
            ...item,
            status: (idx === j || idx === j + 1) ? 'comparing' as const : 
                    idx >= arr.length - i ? 'sorted' as const : 'default' as const
          })),
          description: `Comparing ${arr[j].value} and ${arr[j + 1].value} (comparison #${comparisons})`
        });
        
        if (arr[j].value > arr[j + 1].value) {
          swaps++;
          
          // Show swap
          steps.push({
            data: arr.map((item, idx) => ({
              ...item,
              status: (idx === j || idx === j + 1) ? 'swapping' as const : 
                      idx >= arr.length - i ? 'sorted' as const : 'default' as const
            })),
            description: `Swapping ${arr[j].value} and ${arr[j + 1].value} (swap #${swaps})`
          });
          
          // Perform swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          
          // Show after swap
          steps.push({
            data: arr.map((item, idx) => ({
              ...item,
              status: (idx === j || idx === j + 1) ? 'active' as const : 
                      idx >= arr.length - i ? 'sorted' as const : 'default' as const
            })),
            description: `Swapped! New positions: ${arr[j].value} and ${arr[j + 1].value}`
          });
        }
      }
      
      // Mark as sorted
      steps.push({
        data: arr.map((item, idx) => ({
          ...item,
          status: idx >= arr.length - i - 1 ? 'sorted' as const : 'default' as const
        })),
        description: `Element ${arr[arr.length - i - 1].value} is now in its final position`
      });
    }
    
    // Final sorted state
    steps.push({
      data: arr.map(item => ({ ...item, status: 'sorted' })),
      description: `Bubble sort complete! Made ${comparisons} comparisons and ${swaps} swaps`
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    
    setTimeout(() => setIsRunning(false), 100);
    
    toast({ 
      title: 'Bubble sort started', 
      description: `${steps.length} steps generated. Press play to watch!` 
    });
  }, [array, visualization, controls, isRunning]);

  const selectionSort = useCallback(() => {
    if (isRunning || array.length === 0) return;
    
    visualization.clearSteps();
    const arr = [...array];
    const steps: VisualizationStep[] = [];
    setIsRunning(true);
    
    let swaps = 0;
    let comparisons = 0;
    
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      
      // Show current minimum
      steps.push({
        data: arr.map((item, idx) => ({
          ...item,
          status: idx < i ? 'sorted' as const : 
                  idx === minIndex ? 'active' as const : 'default' as const
        })),
        description: `Finding minimum from index ${i} onwards. Current minimum: ${arr[minIndex].value}`
      });
      
      for (let j = i + 1; j < arr.length; j++) {
        comparisons++;
        
        // Show comparison
        steps.push({
          data: arr.map((item, idx) => ({
            ...item,
            status: idx < i ? 'sorted' as const : 
                    idx === minIndex ? 'active' as const : 
                    idx === j ? 'comparing' as const : 'default' as const
          })),
          description: `Comparing current minimum ${arr[minIndex].value} with ${arr[j].value} (comparison #${comparisons})`
        });
        
        if (arr[j].value < arr[minIndex].value) {
          minIndex = j;
          
          steps.push({
            data: arr.map((item, idx) => ({
              ...item,
              status: idx < i ? 'sorted' as const : 
                      idx === minIndex ? 'active' as const : 'default' as const
            })),
            description: `New minimum found: ${arr[minIndex].value} at index ${minIndex}`
          });
        }
      }
      
      // Swap if needed
      if (minIndex !== i) {
        swaps++;
        
        steps.push({
          data: arr.map((item, idx) => ({
            ...item,
            status: idx === i || idx === minIndex ? 'swapping' as const : 
                    idx < i ? 'sorted' as const : 'default' as const
          })),
          description: `Swapping ${arr[i].value} at index ${i} with minimum ${arr[minIndex].value} at index ${minIndex} (swap #${swaps})`
        });
        
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
      
      // Mark as sorted
      steps.push({
        data: arr.map((item, idx) => ({
          ...item,
          status: idx <= i ? 'sorted' as const : 'default' as const
        })),
        description: `Position ${i} is now sorted with value ${arr[i].value}`
      });
    }
    
    // Final sorted state
    steps.push({
      data: arr.map(item => ({ ...item, status: 'sorted' })),
      description: `Selection sort complete! Made ${comparisons} comparisons and ${swaps} swaps`
    });

    steps.forEach(step => visualization.addStep(step));
    controls.reset();
    
    setTimeout(() => setIsRunning(false), 100);
    
    toast({ 
      title: 'Selection sort started', 
      description: `${steps.length} steps generated. Press play to watch!` 
    });
  }, [array, visualization, controls, isRunning]);

  const startSorting = useCallback(() => {
    if (array.length === 0) {
      toast({ title: 'Error', description: 'Array is empty. Generate an array first.', variant: 'destructive' });
      return;
    }
    
    if (algorithm === 'bubble') {
      bubbleSort();
    } else {
      selectionSort();
    }
  }, [algorithm, bubbleSort, selectionSort, array.length]);

  const resetArray = useCallback(() => {
    if (isRunning) return;
    
    setArray(prev => prev.map(item => ({ ...item, status: 'default' })));
    visualization.clearSteps();
    controls.reset();
    setIsRunning(false);
    toast({ title: 'Array reset', description: 'All animations cleared' });
  }, [visualization, controls, isRunning]);

  const maxValue = Math.max(...array.map(item => item.value), 1);
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
                  placeholder="Value (1-100)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                  min="1"
                  max="100"
                  disabled={isRunning}
                />
                <Input
                  placeholder="Index (optional)"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  type="number"
                  min="0"
                  max={array.length}
                  disabled={isRunning}
                />
                <Button onClick={insertAtIndex} size="sm" disabled={isRunning}>
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
                  min="0"
                  max={Math.max(0, array.length - 1)}
                  disabled={isRunning}
                />
                <Button onClick={deleteAtIndex} size="sm" variant="destructive" disabled={isRunning}>
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
                  disabled={isRunning}
                />
                <Button onClick={searchElement} size="sm" disabled={isRunning}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[320px] flex items-end justify-center gap-2 overflow-x-auto">
            {array.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center text-muted-foreground">
                <div>
                  <p className="text-lg font-medium">Empty Array</p>
                  <p className="text-sm">Generate a random array or insert elements to get started</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="sync">
                {array.map((item, index) => {
                  const height = Math.max((item.value / maxValue) * 240, 30);
                  const getColor = () => {
                    switch (item.status) {
                      case 'comparing': return 'bg-yellow-500 border-yellow-600';
                      case 'swapping': return 'bg-blue-500 border-blue-600';
                      case 'sorted': return 'bg-green-500 border-green-600';
                      case 'found': return 'bg-purple-500 border-purple-600';
                      case 'active': return 'bg-orange-500 border-orange-600';
                      case 'searching': return 'bg-red-500 border-red-600';
                      default: return 'bg-primary border-primary/60';
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
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className={`${getColor()} text-white rounded-t-lg flex items-end justify-center text-sm font-bold min-w-[40px] relative border-2`}
                        style={{ height: `${height}px` }}
                        animate={{
                          scale: item.status === 'comparing' || item.status === 'swapping' || item.status === 'searching' ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="mb-2">{item.value}</span>
                        {(item.status === 'comparing' || item.status === 'swapping' || item.status === 'searching') && (
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
            )}
          </div>

          {/* Algorithm Selection */}
          <div className="flex gap-4 items-center justify-center">
            <label className="text-sm font-medium">Sort Algorithm:</label>
            <div className="flex gap-2">
              <Button
                variant={algorithm === 'bubble' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm('bubble')}
                disabled={isRunning}
              >
                Bubble Sort
              </Button>
              <Button
                variant={algorithm === 'selection' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm('selection')}
                disabled={isRunning}
              >
                Selection Sort
              </Button>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Button onClick={generateRandomArray} variant="outline" size="sm" disabled={isRunning}>
              <Shuffle className="h-4 w-4 mr-2" />
              Random Array
            </Button>
            <Button onClick={startSorting} variant="default" size="sm" disabled={isRunning || array.length === 0}>
              Start {algorithm === 'bubble' ? 'Bubble' : 'Selection'} Sort
            </Button>
            <Button onClick={controls.stepBackward} variant="outline" size="sm" disabled={controls.currentStep === 0 || isRunning}>
              <StepBack className="h-4 w-4" />
            </Button>
            <Button onClick={controls.isPlaying ? controls.pause : controls.play} variant="outline" size="sm" disabled={visualization.totalSteps === 0}>
              {controls.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={controls.stepForward} variant="outline" size="sm" disabled={controls.currentStep >= visualization.totalSteps - 1 || isRunning}>
              <StepForward className="h-4 w-4" />
            </Button>
            <Button onClick={resetArray} variant="outline" size="sm" disabled={isRunning}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-4 justify-center">
            <span className="text-sm font-medium">Speed:</span>
            <div className="flex-1 max-w-xs">
              <Slider
                value={[controls.speed]}
                onValueChange={(value) => controls.setSpeed(value[0])}
                min={0.25}
                max={4}
                step={0.25}
                disabled={isRunning}
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
                <li>• Memory management in operating systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sorting algorithms in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Search engines (relevance ranking)</li>
                <li>• E-commerce (price, rating sorting)</li>
                <li>• Data analysis and reporting</li>
                <li>• File system organization</li>
                <li>• Database query optimization</li>
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
            <Button asChild variant="outline" size="sm">
              <a href="https://visualgo.net/en/sorting" target="_blank" rel="noopener noreferrer">
                VisuAlgo - Sorting
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArrayVisualizer;
