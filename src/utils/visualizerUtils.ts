
import { ArrayItem, VisualizerStep } from '../types/visualizer';

export const generateRandomArray = (size: number = 15): ArrayItem[] => {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 100) + 5,
    status: 'default' as const
  }));
};

export const generateMockSteps = (initialArray: ArrayItem[], pseudoCodeLength: number): VisualizerStep[] => {
  const steps: VisualizerStep[] = [];
  
  // For demo purposes, we'll just create some random visualizations
  // In a real implementation, we would compute the actual algorithm steps
  for (let i = 0; i < 20; i++) {
    const modifiedArray = [...initialArray].map((item, index) => {
      if (i % 5 === 0 && index === i % initialArray.length) {
        return { ...item, status: 'comparing' };
      }
      if (i % 7 === 0 && index === (i + 1) % initialArray.length) {
        return { ...item, status: 'current' };
      }
      if (i % 3 === 0 && index < i / 2) {
        return { ...item, status: 'sorted' };
      }
      if (i % 9 === 0 && index === Math.floor(initialArray.length / 2)) {
        return { ...item, status: 'pivot' };
      }
      return { ...item, status: 'default' };
    });
    
    steps.push({
      array: modifiedArray,
      lineIndex: i % pseudoCodeLength
    });
  }
  
  return steps;
};

export const getStatusColor = (status: ArrayItem['status']): string => {
  switch (status) {
    case 'comparing': return 'bg-yellow-500';
    case 'sorted': return 'bg-green-500';
    case 'pivot': return 'bg-purple-500';
    case 'current': return 'bg-primary';
    default: return 'bg-gray-300';
  }
};
