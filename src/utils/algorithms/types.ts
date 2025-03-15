
import { Category } from './categories';
import { GuideSlide } from '../../types/visualizer';

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
  realWorldExamples?: {
    title: string;
    description: string;
    industry: string;
  }[];
  slides?: GuideSlide[];
}
