
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
