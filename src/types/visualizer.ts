
import { Algorithm } from '../utils/algorithms';

export interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'sorted' | 'pivot' | 'current';
}

export interface VisualizerProps {
  algorithm: Algorithm;
}

export interface VisualizerStep {
  array: ArrayItem[];
  lineIndex: number;
}

// Rename this to match what's being imported in the visualization files
export interface VisualizationStep {
  array: ArrayItem[];
  lineIndex: number;
}

export interface GuideSlide {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export interface AlgorithmGuideProps {
  algorithm: Algorithm;
  onSkip: () => void;
}
