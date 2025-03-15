
import { ArrayItem, VisualizerStep } from '../../types/visualizer';

// Helper function to convert raw visualizer data to a format suitable for export
export const exportVisualizationData = (
  algorithmId: string,
  steps: VisualizerStep[],
  currentStep: number
) => {
  // Create an export object with metadata
  const exportData = {
    algorithm: algorithmId,
    totalSteps: steps.length,
    currentStep,
    timestamp: new Date().toISOString(),
    steps
  };

  // Convert to JSON with pretty printing
  const jsonData = JSON.stringify(exportData, null, 2);
  
  // Create a download link
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${algorithmId}-visualization-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Helper function to generate random array of numbers
export const generateRandomArray = (length: number = 10, min: number = 5, max: number = 100, isSorted: boolean = false): ArrayItem[] => {
  const array = Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  
  if (isSorted) {
    array.sort((a, b) => a - b);
  }
  
  return array.map(value => ({ value, status: 'default' }));
};

// Helper function to get a random index for target in search algorithms
export const getRandomTargetIndex = (arrayLength: number): number => {
  // Use -1 occasionally to simulate "not found" cases
  const includeNotFound = Math.random() > 0.8;
  return includeNotFound ? -1 : Math.floor(Math.random() * arrayLength);
};

// Helper function to parse a user-provided array string
export const parseUserArrayInput = (input: string): number[] => {
  try {
    // Remove brackets if present
    const cleanedInput = input.replace(/^\[|\]$/g, '').trim();
    
    // Split by commas and convert to numbers
    const numbers = cleanedInput.split(',').map(num => {
      const parsed = parseFloat(num.trim());
      if (isNaN(parsed)) {
        throw new Error(`Invalid number: ${num}`);
      }
      return parsed;
    });
    
    return numbers;
  } catch (error) {
    throw new Error(`Invalid input format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
