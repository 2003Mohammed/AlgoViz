
import { generateBubbleSortSteps } from './bubbleSort';
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function getVisualizationSteps(algorithm: string, array: ArrayItem[]): VisualizationStep[] {
  switch (algorithm) {
    case 'bubble-sort':
      return generateBubbleSortSteps(array);
    // Add other algorithms here in the future
    default:
      // For now, return empty steps for other algorithms
      return [{
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: -1
      }];
  }
}
