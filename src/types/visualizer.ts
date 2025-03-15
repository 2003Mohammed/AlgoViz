
// Array visualizer types
export interface ArrayItem {
  value: any;
  status?: 'default' | 'comparing' | 'swapping' | 'sorted' | 'visited' | 'found' | 'removing' | 'added';
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

// Graph visualizer types
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  color?: string;
  status?: 'default' | 'visited' | 'processing' | 'path';
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
  left?: string | null;
  right?: string | null;
  status?: 'default' | 'visited' | 'inserted' | 'removed' | 'found';
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
}
