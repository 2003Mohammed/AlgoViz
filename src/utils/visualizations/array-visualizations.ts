
import { ArrayItem, VisualizationStep } from '../../types/visualizer';

/**
 * Visualizes array operations like add, remove, search
 */
export function visualizeArrayOperation(array: any[], operation: string, value?: any): VisualizationStep[] {
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
}
