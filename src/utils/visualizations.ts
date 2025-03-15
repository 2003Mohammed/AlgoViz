
import { ArrayItem, VisualizationStep } from '../types/visualizer';

// Array visualization
export const visualizeArrayOperation = (array: any[], operation: string, value?: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: 'default' }));
  
  // Initial state
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
  });
  
  if (operation === 'add') {
    // Visualization for adding an element
    const updatedArray = [...initialArray];
    const newItem = { value, status: 'added' };
    
    // Show array before addition
    steps.push({
      array: [...updatedArray],
      lineIndex: 1,
    });
    
    // Show adding the element
    updatedArray.push(newItem);
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
    });
    
    // Show array after addition with new element highlighted
    const finalArray = updatedArray.map((item, index) => 
      index === updatedArray.length - 1 
        ? { ...item, status: 'added' } 
        : { ...item, status: 'default' }
    );
    
    steps.push({
      array: finalArray,
      lineIndex: 3,
    });
  } 
  else if (operation === 'remove') {
    // Visualization for removing an element
    const updatedArray = [...initialArray];
    
    // Highlight last element to be removed
    const highlightArray = updatedArray.map((item, index) => 
      index === updatedArray.length - 1 
        ? { ...item, status: 'removing' } 
        : { ...item, status: 'default' }
    );
    
    steps.push({
      array: [...highlightArray],
      lineIndex: 1,
    });
    
    // Show array after removal
    updatedArray.pop();
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
    });
  }
  else if (operation === 'search') {
    // Visualization for searching
    const searchSteps = [];
    for (let i = 0; i < initialArray.length; i++) {
      const currentArray = initialArray.map((item, idx) => {
        if (idx < i) return { ...item, status: 'visited' };
        if (idx === i) return { ...item, status: 'comparing' };
        return { ...item, status: 'default' };
      });
      
      searchSteps.push({
        array: [...currentArray],
        lineIndex: 1,
        currentIndex: i,
      });
      
      // If found, highlight the element
      if (initialArray[i].value === value) {
        const foundArray = initialArray.map((item, idx) => {
          if (idx === i) return { ...item, status: 'found' };
          if (idx < i) return { ...item, status: 'visited' };
          return { ...item, status: 'default' };
        });
        
        searchSteps.push({
          array: [...foundArray],
          lineIndex: 2,
          currentIndex: i,
        });
        break;
      }
      
      // If we've reached the end without finding
      if (i === initialArray.length - 1) {
        searchSteps.push({
          array: initialArray.map(item => ({ ...item, status: 'visited' })),
          lineIndex: 3,
        });
      }
    }
    
    steps.push(...searchSteps);
  }
  
  return steps;
};

// Stack visualization
export const visualizeStackOperation = (stack: any[], operation: string, value?: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const initialStack = stack.map(item => ({ value: item, status: 'default' }));
  
  // Initial state
  steps.push({
    array: [...initialStack],
    lineIndex: 0,
  });
  
  if (operation === 'push') {
    // Show stack before push
    steps.push({
      array: [...initialStack],
      lineIndex: 1,
    });
    
    // Show pushing the element (stacks show newest items at top/beginning)
    const newItem = { value, status: 'added' };
    const updatedStack = [newItem, ...initialStack];
    
    steps.push({
      array: [...updatedStack],
      lineIndex: 2,
    });
    
    // Show stack after push with new element highlighted
    steps.push({
      array: updatedStack.map((item, index) => 
        index === 0 ? item : { ...item, status: 'default' }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'pop') {
    // Highlight top element to be popped
    const highlightStack = initialStack.map((item, index) => 
      index === 0 ? { ...item, status: 'removing' } : { ...item, status: 'default' }
    );
    
    steps.push({
      array: [...highlightStack],
      lineIndex: 1,
    });
    
    // Show stack after pop
    const updatedStack = [...initialStack];
    updatedStack.shift();
    
    steps.push({
      array: [...updatedStack],
      lineIndex: 2,
    });
  }
  else if (operation === 'peek') {
    // Highlight top element for peek
    const peekStack = initialStack.map((item, index) => 
      index === 0 ? { ...item, status: 'comparing' } : { ...item, status: 'default' }
    );
    
    steps.push({
      array: [...peekStack],
      lineIndex: 1,
    });
    
    // Show peek result
    steps.push({
      array: [...peekStack],
      lineIndex: 2,
    });
  }
  
  return steps;
};

// Queue visualization
export const visualizeQueueOperation = (queue: any[], operation: string, value?: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const initialQueue = queue.map(item => ({ value: item, status: 'default' }));
  
  // Initial state
  steps.push({
    array: [...initialQueue],
    lineIndex: 0,
  });
  
  if (operation === 'enqueue') {
    // Show queue before enqueue
    steps.push({
      array: [...initialQueue],
      lineIndex: 1,
    });
    
    // Show enqueuing the element (added to end)
    const newItem = { value, status: 'added' };
    const updatedQueue = [...initialQueue, newItem];
    
    steps.push({
      array: [...updatedQueue],
      lineIndex: 2,
    });
    
    // Show queue after enqueue with new element highlighted
    steps.push({
      array: updatedQueue.map((item, index) => 
        index === updatedQueue.length - 1 ? item : { ...item, status: 'default' }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'dequeue') {
    // Highlight front element to be dequeued
    const highlightQueue = initialQueue.map((item, index) => 
      index === 0 ? { ...item, status: 'removing' } : { ...item, status: 'default' }
    );
    
    steps.push({
      array: [...highlightQueue],
      lineIndex: 1,
    });
    
    // Show queue after dequeue
    const updatedQueue = [...initialQueue];
    updatedQueue.shift();
    
    steps.push({
      array: [...updatedQueue],
      lineIndex: 2,
    });
  }
  
  return steps;
};

// Binary tree visualization functions (to be implemented)
export const visualizeBinaryTreeOperation = (tree: any, operation: string, value?: any) => {
  // Implement binary tree visualizations
  return [];
};

// Hash table visualization functions (to be implemented)
export const visualizeHashTableOperation = (table: any, operation: string, key?: string, value?: any) => {
  // Implement hash table visualizations
  return [];
};
