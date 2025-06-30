
export * from './array-visualizations';
export * from './search-visualizations';
export * from './sort-visualizations';
export * from './hash-table-visualizations';
export * from './graph-visualizations';
export * from './enhanced-visualizations';
export * from './constants';
export * from './queue-visualizations';
export * from './stack-visualizations';

// Import specific functions for routing
import { visualizeBubbleSort, visualizeQuickSort, visualizeMergeSort, visualizeHeapSort, visualizeInsertionSort } from './sort-visualizations';
import { visualizeLinearSearch, visualizeBinarySearch, visualizeJumpSearch } from './search-visualizations';
import { visualizeBFS, visualizeDFS, visualizeDijkstra } from './graph-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeArrayOperation } from './array-visualizations';

// Graph operation visualizer for graph algorithms
export function visualizeGraphOperation(graph: any, operation: string, startNode?: string, endNode?: string): any[] {
  console.log('Visualizing graph operation:', operation, 'from', startNode, 'to', endNode);
  
  switch (operation.toLowerCase()) {
    case 'bfs':
    case 'breadthfirst':
      return visualizeBFS(startNode || 'A');
    case 'dfs':
    case 'depthfirst':
      return visualizeDFS(startNode || 'A');
    case 'dijkstra':
      return visualizeDijkstra(startNode || 'A');
    default:
      return [{ 
        array: [{ value: 'Graph visualization', status: 'default' }], 
        lineIndex: 0,
        description: `Graph ${operation} visualization`
      }];
  }
}

// Main visualization function that routes to appropriate visualizer
export function generateVisualizationSteps(algorithmId: string, data: any): any[] {
  console.log('Generating visualization steps for:', algorithmId, data);
  
  try {
    switch (algorithmId) {
      // Sorting algorithms
      case 'bubble-sort':
        return visualizeBubbleSort(data.map((item: any) => item.value || item));
      case 'quick-sort':
        return visualizeQuickSort(data.map((item: any) => item.value || item));
      case 'merge-sort':
        return visualizeMergeSort(data.map((item: any) => item.value || item));
      case 'heap-sort':
        return visualizeHeapSort(data.map((item: any) => item.value || item));
      case 'insertion-sort':
        return visualizeInsertionSort(data.map((item: any) => item.value || item));
      
      // Search algorithms
      case 'linear-search':
        return visualizeLinearSearch(data.map((item: any) => item.value || item), data.target || 5);
      case 'binary-search':
        return visualizeBinarySearch(data.map((item: any) => item.value || item), data.target || 5);
      case 'jump-search':
        return visualizeJumpSearch(data.map((item: any) => item.value || item), data.target || 5);
      
      // Graph algorithms
      case 'bfs':
      case 'breadth-first-search':
        return visualizeBFS('A');
      case 'dfs':
      case 'depth-first-search':
        return visualizeDFS('A');
      case 'dijkstra':
      case 'dijkstra-algorithm':
        return visualizeDijkstra('A');
      
      // Data structure operations
      case 'queue-enqueue':
        return visualizeQueueOperation(data.map((item: any) => item.value || item), 'enqueue', data.newValue);
      case 'queue-dequeue':
        return visualizeQueueOperation(data.map((item: any) => item.value || item), 'dequeue');
      case 'stack-push':
        return visualizeStackOperation(data.map((item: any) => item.value || item), 'push', data.newValue);
      case 'stack-pop':
        return visualizeStackOperation(data.map((item: any) => item.value || item), 'pop');
      case 'stack-peek':
        return visualizeStackOperation(data.map((item: any) => item.value || item), 'peek');
      case 'array-add':
        return visualizeArrayOperation(data.map((item: any) => item.value || item), 'add', data.newValue);
      case 'array-remove':
        return visualizeArrayOperation(data.map((item: any) => item.value || item), 'remove');
      case 'array-search':
        return visualizeArrayOperation(data.map((item: any) => item.value || item), 'search', data.target);
      
      default:
        console.warn('Unknown algorithm:', algorithmId);
        return [{ 
          array: Array.isArray(data) ? data.map((item: any) => ({ 
            value: item.value || item, 
            status: 'default' 
          })) : [{ value: 'No data', status: 'default' }], 
          lineIndex: 0,
          description: 'Algorithm visualization not available'
        }];
    }
  } catch (error) {
    console.error('Error generating visualization steps:', error);
    return [{ 
      array: [{ value: 'Error', status: 'default' }], 
      lineIndex: 0,
      description: 'Error generating visualization'
    }];
  }
}
