
import { VisualizationStep, ArrayItem } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes stack reverse operation using recursion
 */
export function visualizeStackReverse(stack: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = stack.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  // Simulate recursive reversal
  const tempStack: any[] = [];
  
  // Pop all elements
  while (arr.length > 0) {
    const currentArray = JSON.parse(JSON.stringify(arr));
    currentArray[0].status = ITEM_STATUSES.REMOVING;
    steps.push({ array: currentArray, lineIndex: arr.length });
    
    const popped = arr.shift();
    if (popped) {
      tempStack.push(popped);
    }
    steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: arr.length });
  }
  
  // Push back in reverse order
  while (tempStack.length > 0) {
    const item = tempStack.pop();
    if (item) {
      item.status = ITEM_STATUSES.ADDED;
      arr.unshift(item);
      steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: arr.length });
    }
  }
  
  return steps;
}

/**
 * Visualizes balanced parentheses check
 */
export function visualizeBalancedParentheses(expression: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const stack: ArrayItem[] = [];
  const chars = expression.split('');
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const currentArray = [...stack];
    
    if (char === '(' || char === '[' || char === '{') {
      // Push opening bracket
      currentArray.push({ value: char, status: ITEM_STATUSES.ADDED });
      stack.push({ value: char, status: ITEM_STATUSES.DEFAULT });
      
      steps.push({
        array: currentArray,
        lineIndex: i,
        description: `Push '${char}' onto stack`
      });
    } else if (char === ')' || char === ']' || char === '}') {
      if (stack.length === 0) {
        // Unbalanced - no matching opening bracket
        steps.push({
          array: currentArray,
          lineIndex: i,
          description: `Error: No matching opening bracket for '${char}'`
        });
        break;
      }
      
      const top = stack[stack.length - 1];
      const isMatching = 
        (char === ')' && top.value === '(') ||
        (char === ']' && top.value === '[') ||
        (char === '}' && top.value === '{');
      
      if (isMatching) {
        // Pop matching bracket
        currentArray[currentArray.length - 1].status = ITEM_STATUSES.REMOVING;
        steps.push({
          array: currentArray,
          lineIndex: i,
          description: `Pop '${top.value}' - matches '${char}'`
        });
        
        stack.pop();
        steps.push({
          array: [...stack],
          lineIndex: i
        });
      } else {
        // Mismatched bracket
        steps.push({
          array: currentArray,
          lineIndex: i,
          description: `Error: '${char}' doesn't match '${top.value}'`
        });
        break;
      }
    }
  }
  
  // Final check
  if (stack.length === 0) {
    steps.push({
      array: [],
      lineIndex: chars.length,
      description: "Balanced: All brackets matched!"
    });
  } else {
    steps.push({
      array: stack,
      lineIndex: chars.length,
      description: "Unbalanced: Unmatched opening brackets remain"
    });
  }
  
  return steps;
}

/**
 * Visualizes circular queue operations
 */
export function visualizeCircularQueue(queue: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const maxSize = 8; // Fixed size for circular queue
  const arr = new Array(maxSize).fill(null).map((_, index) => ({
    value: index < queue.length ? queue[index] : null,
    status: ITEM_STATUSES.DEFAULT as ArrayItem['status']
  }));
  
  let front = 0;
  let rear = queue.length - 1;
  
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0,
    description: `Circular Queue (front: ${front}, rear: ${rear})`
  });
  
  if (operation === 'enqueue') {
    if (queue.length >= maxSize) {
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: 0,
        description: "Queue is full!"
      });
    } else {
      rear = (rear + 1) % maxSize;
      arr[rear] = { value, status: ITEM_STATUSES.ADDED };
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: rear,
        description: `Enqueued ${value} at position ${rear}`
      });
    }
  } else if (operation === 'dequeue') {
    if (queue.length === 0) {
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: 0,
        description: "Queue is empty!"
      });
    } else {
      arr[front].status = ITEM_STATUSES.REMOVING;
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: front,
        description: `Dequeued ${arr[front].value} from position ${front}`
      });
      
      arr[front] = { value: null, status: ITEM_STATUSES.DEFAULT };
      front = (front + 1) % maxSize;
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: front,
        description: `New front at position ${front}`
      });
    }
  }
  
  return steps;
}

/**
 * Visualizes priority queue operations
 */
export function visualizePriorityQueue(queue: Array<{value: any, priority: number}>, operation: string, item?: {value: any, priority: number}): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = queue.map(item => ({ 
    value: `${item.value}(${item.priority})`, 
    status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] 
  }));
  
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0,
    description: "Priority Queue (value(priority))"
  });
  
  if (operation === 'enqueue' && item) {
    // Find correct position based on priority (higher priority = higher number)
    let insertIndex = 0;
    for (let i = 0; i < queue.length; i++) {
      if (item.priority <= queue[i].priority) {
        insertIndex = i;
        break;
      }
      insertIndex = i + 1;
    }
    
    // Highlight insertion point
    const insertArray = JSON.parse(JSON.stringify(arr));
    if (insertIndex < insertArray.length) {
      insertArray[insertIndex].status = ITEM_STATUSES.COMPARING;
    }
    
    steps.push({
      array: insertArray,
      lineIndex: insertIndex,
      description: `Finding position for priority ${item.priority}`
    });
    
    // Insert the new item
    const newItem = { value: `${item.value}(${item.priority})`, status: ITEM_STATUSES.ADDED };
    arr.splice(insertIndex, 0, newItem);
    
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      lineIndex: insertIndex,
      description: `Inserted ${item.value} with priority ${item.priority}`
    });
  } else if (operation === 'dequeue') {
    if (arr.length === 0) {
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: 0,
        description: "Priority queue is empty!"
      });
    } else {
      // Remove highest priority element (last in array)
      const lastIndex = arr.length - 1;
      arr[lastIndex].status = ITEM_STATUSES.REMOVING;
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: lastIndex,
        description: `Dequeuing highest priority element`
      });
      
      arr.pop();
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: lastIndex,
        description: "Removed highest priority element"
      });
    }
  }
  
  return steps;
}

/**
 * Visualizes linked list loop detection
 */
export function visualizeLoopDetection(nodes: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  // Floyd's Cycle Detection Algorithm
  let slow = 0;
  let fast = 0;
  let hasLoop = false;
  
  steps.push({
    array: nodes.map(node => ({ ...node, status: ITEM_STATUSES.DEFAULT })),
    lineIndex: 0,
    description: "Starting Floyd's Cycle Detection (Tortoise and Hare)"
  });
  
  while (fast < nodes.length && nodes[fast].next !== null) {
    // Move slow pointer one step
    if (nodes[slow].next !== null) {
      slow = nodes[slow].next;
    }
    
    // Move fast pointer two steps
    if (nodes[fast].next !== null && nodes[nodes[fast].next].next !== null) {
      fast = nodes[nodes[fast].next].next;
    } else {
      break;
    }
    
    // Visualize current positions
    const currentArray = nodes.map((node, index) => ({
      ...node,
      status: index === slow ? ITEM_STATUSES.COMPARING :
              index === fast ? ITEM_STATUSES.ACTIVE :
              ITEM_STATUSES.DEFAULT
    }));
    
    steps.push({
      array: currentArray,
      lineIndex: Math.max(slow, fast),
      description: `Slow at ${slow}, Fast at ${fast}`
    });
    
    // Check if pointers meet
    if (slow === fast) {
      hasLoop = true;
      break;
    }
  }
  
  // Final result
  const finalArray = nodes.map((node, index) => ({
    ...node,
    status: hasLoop && (index === slow || index === fast) ? ITEM_STATUSES.FOUND :
            ITEM_STATUSES.DEFAULT
  }));
  
  steps.push({
    array: finalArray,
    lineIndex: hasLoop ? slow : -1,
    description: hasLoop ? "Loop detected!" : "No loop found"
  });
  
  return steps;
}
