
export interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found';
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
  visited?: boolean;
  current?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
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
}
