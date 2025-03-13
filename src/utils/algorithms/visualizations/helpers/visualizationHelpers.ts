
import { ArrayItem, VisualizationStep } from '../../../../types/visualizer';

/**
 * Creates a deep copy of an array with optional status updates
 */
export function createArraySnapshot(
  array: ArrayItem[], 
  indices?: number[], 
  status?: ArrayItem['status']
): ArrayItem[] {
  const snapshot = JSON.parse(JSON.stringify(array));
  
  if (indices && status) {
    indices.forEach(index => {
      if (index >= 0 && index < snapshot.length) {
        snapshot[index].status = status;
      }
    });
  }
  
  return snapshot;
}

/**
 * Creates a visualization step with the given array and line index
 */
export function createVisualizationStep(
  array: ArrayItem[], 
  lineIndex: number
): VisualizationStep {
  return {
    array: JSON.parse(JSON.stringify(array)),
    lineIndex
  };
}
