
import { getVisualizationSteps } from '../algorithms/visualizations';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';

// Centralized visualization generator
export function generateVisualizationSteps(algorithmId: string, array: ArrayItem[]): VisualizationStep[] {
  return getVisualizationSteps(algorithmId, array);
}

// Data structure operation visualizers
export function visualizeArrayOperation(array: any[], operation: string, value: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = [...array];
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(initialArray.map(item => ({ value: item, status: 'default' as const })))),
    lineIndex: 0
  });
  
  let resultArray = [...initialArray];
  
  switch(operation) {
    case 'add':
      // Highlight the position where the element will be added
      steps.push({
        array: JSON.parse(JSON.stringify(initialArray.map(item => ({ value: item, status: 'default' as const })))),
        lineIndex: 1
      });
      
      // Add the element
      resultArray.push(value);
      steps.push({
        array: JSON.parse(JSON.stringify(resultArray.map((item, idx) => ({ 
          value: item, 
          status: idx === resultArray.length - 1 ? 'added' as const : 'default' as const 
        })))),
        lineIndex: 2
      });
      break;
      
    case 'remove':
      if (initialArray.length > 0) {
        // Highlight the element to be removed
        steps.push({
          array: JSON.parse(JSON.stringify(initialArray.map((item, idx) => ({ 
            value: item, 
            status: idx === initialArray.length - 1 ? 'removing' as const : 'default' as const 
          })))),
          lineIndex: 1
        });
        
        // Remove the element
        resultArray.pop();
        steps.push({
          array: JSON.parse(JSON.stringify(resultArray.map(item => ({ value: item, status: 'default' as const })))),
          lineIndex: 2
        });
      }
      break;
      
    case 'search':
      const foundIndex = initialArray.indexOf(value);
      
      // Start the search
      steps.push({
        array: JSON.parse(JSON.stringify(initialArray.map(item => ({ value: item, status: 'default' as const })))),
        lineIndex: 1
      });
      
      // Sequential search visualization
      for (let i = 0; i <= (foundIndex !== -1 ? foundIndex : initialArray.length - 1); i++) {
        steps.push({
          array: JSON.parse(JSON.stringify(initialArray.map((item, idx) => ({ 
            value: item, 
            status: idx === i ? (item === value ? 'found' as const : 'comparing' as const) : 
                    idx < i ? 'visited' as const : 'default' as const
          })))),
          lineIndex: i % 2 === 0 ? 2 : 3
        });
      }
      
      // Final result
      steps.push({
        array: JSON.parse(JSON.stringify(initialArray.map((item, idx) => ({ 
          value: item, 
          status: idx === foundIndex ? 'found' as const : 'default' as const
        })))),
        lineIndex: foundIndex !== -1 ? 4 : 5
      });
      break;
  }
  
  return steps;
}

// Stack visualizations
export function visualizeStackOperation(stack: any[], operation: string, value: any = null): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialStack = [...stack];
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(initialStack.map(item => ({ value: item, status: 'default' as const })))),
    lineIndex: 0
  });
  
  let resultStack = [...initialStack];
  
  switch(operation) {
    case 'push':
      // Prepare to push
      steps.push({
        array: JSON.parse(JSON.stringify(initialStack.map(item => ({ value: item, status: 'default' as const })))),
        lineIndex: 1
      });
      
      // Push the element
      resultStack = [value, ...resultStack];
      steps.push({
        array: JSON.parse(JSON.stringify(resultStack.map((item, idx) => ({ 
          value: item, 
          status: idx === 0 ? 'added' as const : 'default' as const 
        })))),
        lineIndex: 2
      });
      break;
      
    case 'pop':
      if (initialStack.length > 0) {
        // Highlight the element to be popped
        steps.push({
          array: JSON.parse(JSON.stringify(initialStack.map((item, idx) => ({ 
            value: item, 
            status: idx === 0 ? 'removing' as const : 'default' as const 
          })))),
          lineIndex: 1
        });
        
        // Pop the element
        resultStack.shift();
        steps.push({
          array: JSON.parse(JSON.stringify(resultStack.map(item => ({ value: item, status: 'default' as const })))),
          lineIndex: 2
        });
      }
      break;
      
    case 'peek':
      if (initialStack.length > 0) {
        // Highlight the top element
        steps.push({
          array: JSON.parse(JSON.stringify(initialStack.map((item, idx) => ({ 
            value: item, 
            status: idx === 0 ? 'comparing' as const : 'default' as const 
          })))),
          lineIndex: 1
        });
      }
      break;
  }
  
  return steps;
}

// Queue visualizations
export function visualizeQueueOperation(queue: any[], operation: string, value: any = null): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialQueue = [...queue];
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(initialQueue.map(item => ({ value: item, status: 'default' as const })))),
    lineIndex: 0
  });
  
  let resultQueue = [...initialQueue];
  
  switch(operation) {
    case 'enqueue':
      // Prepare to enqueue
      steps.push({
        array: JSON.parse(JSON.stringify(initialQueue.map(item => ({ value: item, status: 'default' as const })))),
        lineIndex: 1
      });
      
      // Enqueue the element
      resultQueue.push(value);
      steps.push({
        array: JSON.parse(JSON.stringify(resultQueue.map((item, idx) => ({ 
          value: item, 
          status: idx === resultQueue.length - 1 ? 'added' as const : 'default' as const 
        })))),
        lineIndex: 2
      });
      break;
      
    case 'dequeue':
      if (initialQueue.length > 0) {
        // Highlight the element to be dequeued
        steps.push({
          array: JSON.parse(JSON.stringify(initialQueue.map((item, idx) => ({ 
            value: item, 
            status: idx === 0 ? 'removing' as const : 'default' as const 
          })))),
          lineIndex: 1
        });
        
        // Dequeue the element
        resultQueue.shift();
        steps.push({
          array: JSON.parse(JSON.stringify(resultQueue.map(item => ({ value: item, status: 'default' as const })))),
          lineIndex: 2
        });
      }
      break;
  }
  
  return steps;
}

// Utilities for generating graph and tree visualization steps
export function visualizeGraphOperation() {
  // To be implemented for graph operations
}

export function visualizeTreeOperation() {
  // To be implemented for tree operations
}
