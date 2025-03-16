
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes array operations like add, remove, search
 */
export function visualizeArrayOperation(array: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
  });
  
  if (operation === 'add') {
    const updatedArray = [...initialArray];
    const newItem = { value, status: ITEM_STATUSES.ADDED as ArrayItem['status'] };
    
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
          ? { ...item, status: ITEM_STATUSES.ADDED as ArrayItem['status'] } 
          : { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'remove') {
    const updatedArray = [...initialArray];
    
    const highlightArray = updatedArray.map((item, index) => 
      index === updatedArray.length - 1 
        ? { ...item, status: ITEM_STATUSES.REMOVING as ArrayItem['status'] } 
        : { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }
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
        if (idx < i) return { ...item, status: ITEM_STATUSES.VISITED as ArrayItem['status'] };
        if (idx === i) return { ...item, status: ITEM_STATUSES.COMPARING as ArrayItem['status'] };
        return { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] };
      });
      
      searchSteps.push({
        array: [...currentArray],
        lineIndex: 1,
        currentIndex: i,
      });
      
      if (initialArray[i].value === value) {
        const foundArray = initialArray.map((item, idx) => {
          if (idx === i) return { ...item, status: ITEM_STATUSES.FOUND as ArrayItem['status'] };
          if (idx < i) return { ...item, status: ITEM_STATUSES.VISITED as ArrayItem['status'] };
          return { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] };
        });
        
        searchSteps.push({
          array: [...foundArray],
          lineIndex: 2,
          currentIndex: i,
        });
        break;
      }
      
      if (i === initialArray.length - 1) {
        const finalArray = initialArray.map(item => ({ ...item, status: ITEM_STATUSES.VISITED as ArrayItem['status'] }));
        
        searchSteps.push({
          array: finalArray,
          lineIndex: 3,
        });
      }
    }
    
    steps.push(...searchSteps);
  }
  
  return steps;
}
