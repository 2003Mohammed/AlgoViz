
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

export function visualizeArrayOperation(array: any[], operation: string, value?: any, index?: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
    description: `Starting ${operation} operation`
  });
  
  switch (operation) {
    case 'add':
      if (value !== undefined) {
        const newItem = { value, status: ITEM_STATUSES.ADDED as ArrayItem['status'] };
        const updatedArray = [...initialArray, newItem];
        
        steps.push({
          array: updatedArray,
          lineIndex: 1,
          description: `Added ${value} to the end of array`
        });
        
        // Final state with normal status
        steps.push({
          array: updatedArray.map(item => ({ ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] })),
          lineIndex: 2,
          description: `Operation completed`
        });
      }
      break;
      
    case 'remove':
      if (initialArray.length > 0) {
        const highlightArray = [...initialArray];
        highlightArray[highlightArray.length - 1].status = ITEM_STATUSES.REMOVING;
        
        steps.push({
          array: highlightArray,
          lineIndex: 1,
          description: `Removing last element: ${highlightArray[highlightArray.length - 1].value}`
        });
        
        const updatedArray = [...initialArray];
        updatedArray.pop();
        
        steps.push({
          array: updatedArray,
          lineIndex: 2,
          description: `Element removed successfully`
        });
      }
      break;
      
    case 'search':
      if (value !== undefined) {
        for (let i = 0; i < initialArray.length; i++) {
          const searchArray = [...initialArray];
          searchArray[i].status = ITEM_STATUSES.COMPARING;
          
          steps.push({
            array: searchArray,
            lineIndex: i + 1,
            description: `Checking index ${i}: ${searchArray[i].value}`
          });
          
          if (searchArray[i].value === value) {
            searchArray[i].status = ITEM_STATUSES.FOUND;
            steps.push({
              array: searchArray,
              lineIndex: i + 2,
              description: `Found ${value} at index ${i}!`
            });
            break;
          }
        }
      }
      break;
      
    case 'bubble-sort':
      let sortArray = [...initialArray];
      for (let i = 0; i < sortArray.length - 1; i++) {
        for (let j = 0; j < sortArray.length - i - 1; j++) {
          // Highlight comparing elements
          const compareArray = [...sortArray];
          compareArray[j].status = ITEM_STATUSES.COMPARING;
          compareArray[j + 1].status = ITEM_STATUSES.COMPARING;
          
          steps.push({
            array: compareArray,
            lineIndex: steps.length,
            description: `Comparing ${compareArray[j].value} and ${compareArray[j + 1].value}`
          });
          
          if (compareArray[j].value > compareArray[j + 1].value) {
            // Highlight swapping
            compareArray[j].status = ITEM_STATUSES.SWAPPING;
            compareArray[j + 1].status = ITEM_STATUSES.SWAPPING;
            
            steps.push({
              array: compareArray,
              lineIndex: steps.length,
              description: `Swapping ${compareArray[j].value} and ${compareArray[j + 1].value}`
            });
            
            // Perform swap
            [sortArray[j], sortArray[j + 1]] = [sortArray[j + 1], sortArray[j]];
            
            steps.push({
              array: [...sortArray],
              lineIndex: steps.length,
              description: `Swapped successfully`
            });
          }
        }
        
        // Mark sorted element
        sortArray[sortArray.length - 1 - i].status = ITEM_STATUSES.SORTED;
        steps.push({
          array: [...sortArray],
          lineIndex: steps.length,
          description: `Element ${sortArray[sortArray.length - 1 - i].value} is now in correct position`
        });
      }
      
      // Mark all as sorted
      sortArray = sortArray.map(item => ({ ...item, status: ITEM_STATUSES.SORTED }));
      steps.push({
        array: sortArray,
        lineIndex: steps.length,
        description: 'Array is completely sorted!'
      });
      break;
  }
  
  return steps;
}
