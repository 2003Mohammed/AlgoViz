
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
  onSkip: (dontShowAgain?: boolean) => void;
}

// New types for different visualization styles
export interface NodeItem {
  id: string;
  value: string | number;
  x?: number;
  y?: number;
  status?: 'default' | 'active' | 'visited' | 'current' | 'path' | 'target';
}

export interface EdgeItem {
  source: string;
  target: string;
  weight?: number;
  status?: 'default' | 'active' | 'path';
}

export interface GraphData {
  nodes: NodeItem[];
  edges: EdgeItem[];
}

export interface TreeNode {
  value: number;
  status?: 'default' | 'active' | 'comparing' | 'sorted';
  left?: TreeNode;
  right?: TreeNode;
}
