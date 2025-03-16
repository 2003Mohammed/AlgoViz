
// Make sure types from ArrayItem.status are consistently used
export const ITEM_STATUSES = {
  DEFAULT: 'default',
  COMPARING: 'comparing',
  SWAPPING: 'swapping',
  SORTED: 'sorted',
  VISITED: 'visited',
  FOUND: 'found',
  REMOVING: 'removing',
  ADDED: 'added',
  CURRENT: 'current',
  PIVOT: 'pivot',
  ACTIVE: 'active',
  TARGET: 'target',
  PATH: 'path',
  PROCESSING: 'processing'
} as const;
