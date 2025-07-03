
export * from './array-visualizations';
export * from './stack-visualizations';
export * from './queue-visualizations';
export * from './hash-table-visualizations';
export * from './graph-visualizations';
export * from './constants';

// Main function to generate visualization steps
export function generateVisualizationSteps(algorithmId: string, data: any): any[] {
  switch (algorithmId) {
    case 'bubble-sort':
    case 'selection-sort':
      return visualizeSorting(data, algorithmId);
    case 'bfs':
    case 'dfs':
    case 'dijkstra':
      return visualizeGraphTraversal(data, algorithmId);
    default:
      return [{
        array: Array.isArray(data) ? data.map((item: any) => ({ 
          value: typeof item === 'object' ? item.value : item, 
          status: 'default' 
        })) : [],
        lineIndex: 0,
        description: `Algorithm: ${algorithmId}`
      }];
  }
}

function visualizeSorting(array: any[], algorithm: string) {
  const steps = [];
  const arr = [...array];
  
  if (algorithm === 'bubble-sort') {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Comparison step
        steps.push({
          array: arr.map((item, index) => ({
            value: typeof item === 'object' ? item.value : item,
            status: index === j || index === j + 1 ? 'comparing' : 'default'
          })),
          lineIndex: steps.length,
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });
        
        if (arr[j] > arr[j + 1]) {
          // Swap step
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            array: arr.map((item, index) => ({
              value: typeof item === 'object' ? item.value : item,
              status: index === j || index === j + 1 ? 'swapping' : 'default'
            })),
            lineIndex: steps.length,
            description: `Swapped ${arr[j + 1]} and ${arr[j]}`
          });
        }
      }
      
      // Mark as sorted
      steps.push({
        array: arr.map((item, index) => ({
          value: typeof item === 'object' ? item.value : item,
          status: index >= arr.length - i - 1 ? 'sorted' : 'default'
        })),
        lineIndex: steps.length,
        description: `Position ${arr.length - i - 1} is now sorted`
      });
    }
  }
  
  return steps;
}

function visualizeGraphTraversal(graphData: any, algorithm: string) {
  const defaultGraph = {
    nodes: [
      { id: 'A', x: 100, y: 100, status: 'default' },
      { id: 'B', x: 200, y: 50, status: 'default' },
      { id: 'C', x: 300, y: 100, status: 'default' },
      { id: 'D', x: 200, y: 150, status: 'default' },
      { id: 'E', x: 150, y: 200, status: 'default' },
      { id: 'F', x: 250, y: 200, status: 'default' }
    ],
    edges: [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'D', status: 'default' },
      { source: 'B', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'C', target: 'F', status: 'default' },
      { source: 'D', target: 'E', status: 'default' },
      { source: 'E', target: 'F', status: 'default' }
    ]
  };
  
  const graph = graphData || defaultGraph;
  
  switch (algorithm) {
    case 'bfs':
      return visualizeBFS(graph, 'A');
    case 'dfs':
      return visualizeDFS(graph, 'A');
    case 'dijkstra':
      return visualizeDijkstra(graph, 'A');
    default:
      return [];
  }
}

// Import functions from other modules to make them available
import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';
import { visualizeGraphOperation, visualizeBFS, visualizeDFS, visualizeDijkstra } from './graph-visualizations';

export {
  visualizeArrayOperation,
  visualizeStackOperation,
  visualizeQueueOperation,
  visualizeHashTableOperation,
  visualizeGraphOperation,
  visualizeBFS,
  visualizeDFS,
  visualizeDijkstra
};
