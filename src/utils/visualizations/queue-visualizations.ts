
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './index';

/**
 * Visualizes queue operations like enqueue, dequeue
 */
export function visualizeQueueOperation(queue: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialQueue = queue.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT }));
  
  steps.push({
    array: [...initialQueue],
    lineIndex: 0,
  });
  
  if (operation === 'enqueue') {
    steps.push({
      array: [...initialQueue],
      lineIndex: 1,
    });
    
    const newItem = { value, status: ITEM_STATUSES.ADDED };
    const updatedQueue = [...initialQueue, newItem];
    
    steps.push({
      array: [...updatedQueue],
      lineIndex: 2,
    });
    
    steps.push({
      array: updatedQueue.map((item, index) => 
        index === updatedQueue.length - 1 ? item : { ...item, status: ITEM_STATUSES.DEFAULT }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'dequeue') {
    const highlightQueue = initialQueue.map((item, index) => 
      index === 0 ? { ...item, status: ITEM_STATUSES.REMOVING } : { ...item, status: ITEM_STATUSES.DEFAULT }
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
