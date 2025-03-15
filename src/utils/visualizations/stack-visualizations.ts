
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './index';

/**
 * Visualizes stack operations like push, pop, peek
 */
export function visualizeStackOperation(stack: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialStack = stack.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT }));
  
  steps.push({
    array: [...initialStack],
    lineIndex: 0,
  });
  
  if (operation === 'push') {
    steps.push({
      array: [...initialStack],
      lineIndex: 1,
    });
    
    const newItem = { value, status: ITEM_STATUSES.ADDED };
    const updatedStack = [newItem, ...initialStack];
    
    steps.push({
      array: [...updatedStack],
      lineIndex: 2,
    });
    
    steps.push({
      array: updatedStack.map((item, index) => 
        index === 0 ? item : { ...item, status: ITEM_STATUSES.DEFAULT }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'pop') {
    const highlightStack = initialStack.map((item, index) => 
      index === 0 ? { ...item, status: ITEM_STATUSES.REMOVING } : { ...item, status: ITEM_STATUSES.DEFAULT }
    );
    
    steps.push({
      array: [...highlightStack],
      lineIndex: 1,
    });
    
    const updatedStack = [...initialStack];
    updatedStack.shift();
    
    steps.push({
      array: [...updatedStack],
      lineIndex: 2,
    });
  }
  else if (operation === 'peek') {
    const peekStack = initialStack.map((item, index) => 
      index === 0 ? { ...item, status: ITEM_STATUSES.COMPARING } : { ...item, status: ITEM_STATUSES.DEFAULT }
    );
    
    steps.push({
      array: [...peekStack],
      lineIndex: 1,
    });
    
    steps.push({
      array: [...peekStack],
      lineIndex: 2,
    });
  }
  
  return steps;
}
