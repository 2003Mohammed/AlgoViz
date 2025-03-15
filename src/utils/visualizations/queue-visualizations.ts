
import { ArrayItem, VisualizationStep } from '../../types/visualizer';

/**
 * Visualizes queue operations like enqueue, dequeue
 */
export function visualizeQueueOperation(queue: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialQueue = queue.map(item => ({ value: item, status: 'default' as const }));
  
  steps.push({
    array: [...initialQueue],
    lineIndex: 0,
  });
  
  if (operation === 'enqueue') {
    steps.push({
      array: [...initialQueue],
      lineIndex: 1,
    });
    
    const newItem = { value, status: 'added' as const };
    const updatedQueue = [...initialQueue, newItem];
    
    steps.push({
      array: [...updatedQueue],
      lineIndex: 2,
    });
    
    steps.push({
      array: updatedQueue.map((item, index) => 
        index === updatedQueue.length - 1 ? item : { ...item, status: 'default' as const }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'dequeue') {
    const highlightQueue = initialQueue.map((item, index) => 
      index === 0 ? { ...item, status: 'removing' as const } : { ...item, status: 'default' as const }
    );
    
    steps.push({
      array: [...highlightQueue],
      lineIndex: 1,
    });
    
    const updatedQueue = [...initialQueue];
    updatedQueue.shift();
    
    steps.push({
      array: [...updatedQueue],
      lineIndex: 2,
    });
  }
  
  return steps;
}
