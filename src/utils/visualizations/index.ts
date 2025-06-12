
export * from './array-visualizations';
export * from './search-visualizations';
export * from './sort-visualizations';
export * from './hash-table-visualizations';
export * from './graph-visualizations';
export * from './enhanced-visualizations';
export * from './constants';

// Main visualization function that routes to appropriate visualizer
export function generateVisualizationSteps(algorithmId: string, data: any): any[] {
  switch (algorithmId) {
    case 'bubble-sort':
    case 'quick-sort':
    case 'merge-sort':
    case 'heap-sort':
    case 'insertion-sort':
      return require('./sort-visualizations')[`visualize${algorithmId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join('')}`](data.map((item: any) => item.value));
    
    case 'linear-search':
    case 'binary-search':
    case 'jump-search':
      return require('./search-visualizations')[`visualize${algorithmId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join('')}`](data.map((item: any) => item.value), data.target || 0);
    
    default:
      return [{ array: data, lineIndex: 0 }];
  }
}
