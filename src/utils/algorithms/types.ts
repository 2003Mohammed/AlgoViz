
import { Category } from './categories';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  pseudocode?: string[];
  implementation?: string;
}
