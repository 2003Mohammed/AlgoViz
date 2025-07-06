
export interface ArrayItem {
  value: number | string;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found' | 'current' | 'visited' | 'added' | 'removing' | 'active' | 'processing' | 'target' | 'path';
  index?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  value?: string | number;
  visited?: boolean;
  current?: boolean;
  status?: 'default' | 'current' | 'visited' | 'found' | 'processing' | 'path' | 'active' | 'target';
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  source?: string;
  target?: string;
  weight?: number;
  status?: 'default' | 'current' | 'visited' | 'found' | 'path';
  directed?: boolean;
}

export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  visited?: boolean;
  current?: boolean;
}

export interface VisualizerProps {
  algorithm: Algorithm;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  timeComplexity?: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity?: string;
  pseudocode?: string[];
  implementation?: string;
  realWorldExamples?: {
    title: string;
    description: string;
    industry: string;
  }[];
  slides?: GuideSlide[];
}

export interface VisualizationStep {
  array?: ArrayItem[];
  graphData?: GraphData;
  treeData?: TreeNode;
  lineIndex: number;
  description?: string;
}

export interface VisualizerStep {
  array: ArrayItem[];
  lineIndex: number;
  description?: string;
}

export interface GuideSlide {
  id?: string;
  title: string;
  content: string;
  code?: string;
  visual?: any;
  image?: string;
}
