
import { generateBubbleSortSteps } from './bubbleSort';
import { generateQuickSortSteps } from './quickSort';
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function getVisualizationSteps(algorithm: string, array: ArrayItem[]): VisualizationStep[] {
  switch (algorithm) {
    case 'bubble-sort':
      return generateBubbleSortSteps(array);
    case 'quick-sort':
      return generateQuickSortSteps(array);
    default:
      return [{
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: -1
      }];
  }
}
