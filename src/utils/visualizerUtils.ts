
import { ArrayItem, VisualizerStep } from '../types/visualizer';

export const getStatusColor = (status: ArrayItem['status']) => {
  switch (status) {
    case 'comparing':
      return 'bg-yellow-500';
    case 'sorted':
      return 'bg-green-500';
    case 'pivot':
      return 'bg-purple-500';
    case 'current':
      return 'bg-blue-500';
    default:
      return 'bg-foreground/80';
  }
};

export const generateRandomArray = (size = 10, max = 100): ArrayItem[] => {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * max) + 1,
    status: 'default' as const
  }));
};

export const generateMockSteps = (array: ArrayItem[], totalLines: number): VisualizerStep[] => {
  const steps: VisualizerStep[] = [];
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(array)),
    lineIndex: -1
  });
  
  // Generate some mock steps for demonstration
  for (let i = 0; i < Math.min(20, array.length * 2); i++) {
    const newArray = JSON.parse(JSON.stringify(steps[steps.length - 1].array)) as ArrayItem[];
    
    // Randomly modify some elements' status
    const idx1 = Math.floor(Math.random() * newArray.length);
    const idx2 = Math.floor(Math.random() * newArray.length);
    
    // Ensure we're using valid status values
    newArray[idx1].status = 'comparing';
    if (idx1 !== idx2) {
      newArray[idx2].status = 'comparing';
    }
    
    // Random line index from the pseudocode
    const lineIndex = Math.floor(Math.random() * totalLines);
    
    steps.push({
      array: newArray,
      lineIndex
    });
  }
  
  // Final step - all sorted
  const finalArray = JSON.parse(JSON.stringify(steps[steps.length - 1].array)) as ArrayItem[];
  finalArray.forEach(item => {
    item.status = 'sorted';
  });
  
  steps.push({
    array: finalArray,
    lineIndex: totalLines - 1
  });
  
  return steps;
};
