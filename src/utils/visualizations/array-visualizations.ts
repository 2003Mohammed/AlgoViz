
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
    description: `Starting ${operation} operation`
  });
  
  if (operation === 'add') {
    // Show preparation step
    steps.push({
      array: [...initialArray],
      lineIndex: 1,
      description: `Preparing to add ${value}`
    });
    
    // Show the new item being added
    const newItem = { value, status: ITEM_STATUSES.ADDED as ArrayItem['status'] };
    const updatedArray = [...initialArray, newItem];
    
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
      description: `Added ${value} to position ${array.length}`
    });
    
    // Final state with normal status
    steps.push({
      array: updatedArray.map(item => ({ ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] })),
      lineIndex: 3,
      description: `Array updated successfully`
    });
  } 
  else if (operation === 'remove') {
    if (array.length === 0) {
      steps.push({
        array: [...initialArray],
        lineIndex: 1,
        description: 'Array is empty, nothing to remove'
      });
      return steps;
    }
    
    // Highlight the element to be removed
    const highlightArray = [...initialArray];
    highlightArray[highlightArray.length - 1].status = ITEM_STATUSES.REMOVING;
    
    steps.push({
      array: [...highlightArray],
      lineIndex: 1,
      description: `Removing element at position ${array.length - 1}`
    });
    
    // Show the array after removal
    const updatedArray = [...initialArray];
    updatedArray.pop();
    
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
      description: `Element removed successfully`
    });
  }
  else if (operation === 'search') {
    let found = false;
    let foundIndex = -1;
    
    // Search through the array step by step
    for (let i = 0; i < array.length; i++) {
      const searchArray = [...initialArray];
      searchArray[i].status = ITEM_STATUSES.COMPARING;
      
      steps.push({
        array: [...searchArray],
        lineIndex: i + 1,
        description: `Checking element at index ${i}: ${array[i]}`
      });
      
      if (array[i] === value) {
        searchArray[i].status = ITEM_STATUSES.FOUND;
        found = true;
        foundIndex = i;
        
        steps.push({
          array: [...searchArray],
          lineIndex: i + 1,
          description: `Found ${value} at index ${i}!`
        });
        break;
      } else {
        searchArray[i].status = ITEM_STATUSES.VISITED;
        steps.push({
          array: [...searchArray],
          lineIndex: i + 1,
          description: `${array[i]} ≠ ${value}, continuing search...`
        });
      }
    }
    
    if (!found) {
      steps.push({
        array: initialArray.map(item => ({ ...item, status: ITEM_STATUSES.VISITED })),
        lineIndex: array.length + 1,
        description: `${value} not found in array`
      });
    }
  }
  
  return steps;
}

/**
 * Enhanced array visualization with more detailed steps
 */
export function visualizeEnhancedArrayOperation(array: any[], operation: string, value?: any, index?: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  switch (operation) {
    case 'insert':
      if (index !== undefined && index >= 0 && index <= array.length) {
        // Show insertion at specific index
        steps.push({
          array: [...initialArray],
          lineIndex: 0,
          description: `Inserting ${value} at index ${index}`
        });
        
        // Highlight the insertion point
        const insertArray = [...initialArray];
        if (index < insertArray.length) {
          insertArray[index].status = ITEM_STATUSES.COMPARING;
        }
        
        steps.push({
          array: [...insertArray],
          lineIndex: 1,
          description: `Shifting elements to make space`
        });
        
        // Show the final state
        const newArray = [...array];
        newArray.splice(index, 0, value);
        const finalArray = newArray.map((item, i) => ({
          value: item,
          status: i === index ? ITEM_STATUSES.ADDED : ITEM_STATUSES.DEFAULT
        }));
        
        steps.push({
          array: finalArray,
          lineIndex: 2,
          description: `Inserted ${value} successfully`
        });
      }
      break;
      
    case 'update':
      if (index !== undefined && index >= 0 && index < array.length) {
        steps.push({
          array: [...initialArray],
          lineIndex: 0,
          description: `Updating index ${index} to ${value}`
        });
        
        const updateArray = [...initialArray];
        updateArray[index].status = ITEM_STATUSES.COMPARING;
        
        steps.push({
          array: [...updateArray],
          lineIndex: 1,
          description: `Found element at index ${index}`
        });
        
        updateArray[index] = { value, status: ITEM_STATUSES.ADDED };
        
        steps.push({
          array: [...updateArray],
          lineIndex: 2,
          description: `Updated successfully`
        });
      }
      break;
  }
  
  return steps;
}
