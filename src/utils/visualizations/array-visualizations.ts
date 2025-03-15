
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './index';

/**
 * Visualizes array operations like add, remove, search
 */
export function visualizeArrayOperation(array: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT }));
  
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
  });
  
  if (operation === 'add') {
    const updatedArray = [...initialArray];
    const newItem = { value, status: ITEM_STATUSES.ADDED };
    
    steps.push({
      array: [...updatedArray],
      lineIndex: 1,
    });
    
    updatedArray.push(newItem);
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
    });
    
    steps.push({
      array: updatedArray.map((item, index) => 
        index === updatedArray.length - 1 
          ? { ...item, status: ITEM_STATUSES.ADDED } 
          : { ...item, status: ITEM_STATUSES.DEFAULT }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'remove') {
    const updatedArray = [...initialArray];
    
    const highlightArray = updatedArray.map((item, index) => 
      index === updatedArray.length - 1 
        ? { ...item, status: ITEM_STATUSES.REMOVING } 
        : { ...item, status: ITEM_STATUSES.DEFAULT }
    );
    
    steps.push({
      array: [...highlightArray],
      lineIndex: 1,
    });
    
    updatedArray.pop();
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
    });
  }
  else if (operation === 'search') {
    const searchSteps = [];
    for (let i = 0; i < initialArray.length; i++) {
      const currentArray = initialArray.map((item, idx) => {
        if (idx < i) return { ...item, status: ITEM_STATUSES.VISITED };
        if (idx === i) return { ...item, status: ITEM_STATUSES.COMPARING };
        return { ...item, status: ITEM_STATUSES.DEFAULT };
      });
      
      searchSteps.push({
        array: [...currentArray],
        lineIndex: 1,
        currentIndex: i,
      });
      
      if (initialArray[i].value === value) {
        const foundArray = initialArray.map((item, idx) => {
          if (idx === i) return { ...item, status: ITEM_STATUSES.FOUND };
          if (idx < i) return { ...item, status: ITEM_STATUSES.VISITED };
          return { ...item, status: ITEM_STATUSES.DEFAULT };
        });
        
        searchSteps.push({
          array: [...foundArray],
          lineIndex: 2,
          currentIndex: i,
        });
        break;
      }
      
      if (i === initialArray.length - 1) {
        searchSteps.push({
          array: initialArray.map(item => ({ ...item, status: ITEM_STATUSES.VISITED })),
          lineIndex: 3,
        });
      }
    }
    
    steps.push(...searchSteps);
  }
  
  return steps;
}
