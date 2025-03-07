
import { categories } from './categories';
import { sortingAlgorithms } from './sorting';
import { searchingAlgorithms } from './searching';
import { graphAlgorithms } from './graph';
import { Algorithm } from './types';

// Combine all algorithms
export const algorithms: Algorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...graphAlgorithms,
];

// Re-export everything
export { categories } from './categories';
export type { Category } from './categories';
export type { Algorithm } from './types';
