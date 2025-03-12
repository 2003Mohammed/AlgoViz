
import { generateBubbleSortSteps } from './bubbleSort';
import { generateQuickSortSteps } from './quickSort';
import { generateMergeSortSteps } from './mergeSort';
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function getVisualizationSteps(algorithm: string, array: ArrayItem[]): VisualizationStep[] {
  switch (algorithm) {
    case 'bubble-sort':
      return generateBubbleSortSteps(array);
    case 'quick-sort':
      return generateQuickSortSteps(array);
    case 'merge-sort':
      return generateMergeSortSteps(array);
    default:
      return [{
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: -1
      }];
  }
}
