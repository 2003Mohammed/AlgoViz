
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

export function visualizeHashTableOperation(
  hashTable: Array<{key: string, value: any}>, 
  operation: string, 
  key?: string, 
  value?: any
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = hashTable.map(item => ({ 
    value: `${item.key}: ${item.value}`, 
    status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] 
  }));
  
  steps.push({
    array: [...arr],
    lineIndex: 0,
    description: `Hash Table Operation: ${operation}`
  });
  
  if (operation === 'set' && key && value !== undefined) {
    const existingIndex = hashTable.findIndex(item => item.key === key);
    
    if (existingIndex >= 0) {
      // Update existing key
      const highlightArray = [...arr];
      highlightArray[existingIndex].status = ITEM_STATUSES.COMPARING;
      steps.push({
        array: highlightArray,
        lineIndex: existingIndex,
        description: `Found existing key: ${key}`
      });
      
      highlightArray[existingIndex] = { 
        value: `${key}: ${value}`, 
        status: ITEM_STATUSES.FOUND 
      };
      steps.push({
        array: highlightArray,
        lineIndex: existingIndex,
        description: `Updated ${key} to ${value}`
      });
    } else {
      // Add new key-value pair
      const newItem = { 
        value: `${key}: ${value}`, 
        status: ITEM_STATUSES.ADDED 
      };
      const newArray = [...arr, newItem];
      steps.push({
        array: newArray,
        lineIndex: newArray.length - 1,
        description: `Added new key-value pair: ${key}: ${value}`
      });
    }
  } else if (operation === 'get' && key) {
    const targetIndex = hashTable.findIndex(item => item.key === key);
    
    for (let i = 0; i < arr.length; i++) {
      const searchArray = [...arr];
      searchArray[i].status = ITEM_STATUSES.COMPARING;
      
      steps.push({
        array: searchArray,
        lineIndex: i,
        description: `Searching for key: ${key}`
      });
      
      if (i === targetIndex) {
        searchArray[i].status = ITEM_STATUSES.FOUND;
        steps.push({
          array: searchArray,
          lineIndex: i,
          description: `Found key: ${key} with value: ${hashTable[i].value}`
        });
        break;
      }
    }
  } else if (operation === 'delete' && key) {
    const targetIndex = hashTable.findIndex(item => item.key === key);
    
    if (targetIndex >= 0) {
      const highlightArray = [...arr];
      highlightArray[targetIndex].status = ITEM_STATUSES.REMOVING;
      
      steps.push({
        array: highlightArray,
        lineIndex: targetIndex,
        description: `Removing key: ${key}`
      });
      
      const newArray = [...arr];
      newArray.splice(targetIndex, 1);
      
      steps.push({
        array: newArray,
        lineIndex: targetIndex,
        description: `Deleted key: ${key}`
      });
    }
  }
  
  return steps;
}
