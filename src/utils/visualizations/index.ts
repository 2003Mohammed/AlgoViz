
import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeBinaryTreeOperation } from './tree-visualizations';
import { visualizeGraphOperation } from './graph-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';

export {
  visualizeArrayOperation,
  visualizeStackOperation,
  visualizeQueueOperation,
  visualizeBinaryTreeOperation,
  visualizeGraphOperation,
  visualizeHashTableOperation
};

// Make sure types from ArrayItem.status are consistently used
export const ITEM_STATUSES = {
  DEFAULT: 'default' as const,
  COMPARING: 'comparing' as const,
  SWAPPING: 'swapping' as const,
  SORTED: 'sorted' as const,
  VISITED: 'visited' as const,
  FOUND: 'found' as const,
  REMOVING: 'removing' as const,
  ADDED: 'added' as const,
  CURRENT: 'current' as const,
  PIVOT: 'pivot' as const,
  ACTIVE: 'active' as const,
  TARGET: 'target' as const,
  PATH: 'path' as const,
  PROCESSING: 'processing' as const
};
