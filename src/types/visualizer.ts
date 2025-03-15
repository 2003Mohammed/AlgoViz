
// Array visualizer types
export interface ArrayItem {
  value: any;
  status?: 'default' | 'comparing' | 'swapping' | 'sorted' | 'visited' | 'found' | 'removing' | 'added' | 'current' | 'pivot' | 'active' | 'target';
}

// Step in the visualization process
export interface VisualizationStep {
  array: ArrayItem[];
  lineIndex: number;
  comparingIndices?: number[];
  swappedIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  currentIndex?: number;
}

// Visualizer steps used by animations
export interface VisualizerStep extends VisualizationStep {}

// Graph visualizer types
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  value?: any;
  color?: string;
  status?: 'default' | 'visited' | 'processing' | 'path' | 'active' | 'target';
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  color?: string;
  status?: 'default' | 'visited' | 'path';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Tree visualizer types
export interface TreeNode {
  id: string;
  value: any;
  left?: TreeNode | null;
  right?: TreeNode | null;
  status?: 'default' | 'visited' | 'inserted' | 'removed' | 'found' | 'active' | 'comparing' | 'sorted';
}

// NodeItem and EdgeItem for general visualization utilities
export interface NodeItem {
  id: string;
  label: string;
  status?: string;
  value?: any;
  x?: number;
  y?: number;
}

export interface EdgeItem {
  source: string;
  target: string;
  label?: string;
  status?: string;
  weight?: number;
}

// Algorithm visualizer props
export interface VisualizerProps {
  algorithm: any;
}

// Slides for algorithm guides
export interface GuideSlide {
  title: string;
  content: string;
  code?: string;
  image?: string;
  id: string; // Changed from optional to required
}
