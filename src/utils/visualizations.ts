import { ArrayItem, VisualizationStep } from '../types/visualizer';

// Array visualization
export const visualizeArrayOperation = (array: any[], operation: string, value?: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: 'default' as const }));
  
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
  });
  
  if (operation === 'add') {
    const updatedArray = [...initialArray];
    const newItem = { value, status: 'added' as const };
    
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
          ? { ...item, status: 'added' as const } 
          : { ...item, status: 'default' as const }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'remove') {
    const updatedArray = [...initialArray];
    
    const highlightArray = updatedArray.map((item, index) => 
      index === updatedArray.length - 1 
        ? { ...item, status: 'removing' as const } 
        : { ...item, status: 'default' as const }
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
        if (idx < i) return { ...item, status: 'visited' as const };
        if (idx === i) return { ...item, status: 'comparing' as const };
        return { ...item, status: 'default' as const };
      });
      
      searchSteps.push({
        array: [...currentArray],
        lineIndex: 1,
        currentIndex: i,
      });
      
      if (initialArray[i].value === value) {
        const foundArray = initialArray.map((item, idx) => {
          if (idx === i) return { ...item, status: 'found' as const };
          if (idx < i) return { ...item, status: 'visited' as const };
          return { ...item, status: 'default' as const };
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
          array: initialArray.map(item => ({ ...item, status: 'visited' as const })),
          lineIndex: 3,
        });
      }
    }
    
    steps.push(...searchSteps);
  }
  
  return steps;
};

// Stack visualization with proper type assertions
export const visualizeStackOperation = (stack: any[], operation: string, value?: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const initialStack = stack.map(item => ({ value: item, status: 'default' as const }));
  
  steps.push({
    array: [...initialStack],
    lineIndex: 0,
  });
  
  if (operation === 'push') {
    steps.push({
      array: [...initialStack],
      lineIndex: 1,
    });
    
    const newItem = { value, status: 'added' as const };
    const updatedStack = [newItem, ...initialStack];
    
    steps.push({
      array: [...updatedStack],
      lineIndex: 2,
    });
    
    steps.push({
      array: updatedStack.map((item, index) => 
        index === 0 ? item : { ...item, status: 'default' as const }
      ),
      lineIndex: 3,
    });
  } 
  else if (operation === 'pop') {
    const highlightStack = initialStack.map((item, index) => 
      index === 0 ? { ...item, status: 'removing' as const } : { ...item, status: 'default' as const }
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
      index === 0 ? { ...item, status: 'comparing' as const } : { ...item, status: 'default' as const }
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
};

// Queue visualization with proper type assertions
export const visualizeQueueOperation = (queue: any[], operation: string, value?: any): VisualizationStep[] => {
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
