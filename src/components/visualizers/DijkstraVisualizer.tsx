
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
  distance: number;
  status: 'default' | 'visiting' | 'visited' | 'finalized' | 'current';
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  status: 'default' | 'active' | 'path';
}

interface DijkstraStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  description: string;
  currentNode?: string;
}

const DijkstraVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [newNodeValue, setNewNodeValue] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [startNode, setStartNode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dijkstraSteps, setDijkstraSteps] = useState<DijkstraStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNode = () => {
    if (!newNodeValue.trim()) return;
    
    const nodeExists = nodes.some(node => node.value === newNodeValue.trim());
    if (nodeExists) return;
    
    // Auto-position nodes in a circle
    const angle = (nodes.length * 2 * Math.PI) / Math.max(6, nodes.length + 1);
    const radius = 120;
    const centerX = 250;
    const centerY = 150;
    
    const newNode: GraphNode = {
      id: Math.random().toString(36).substr(2, 9),
      value: newNodeValue.trim(),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      distance: Infinity,
      status: 'default'
    };
    
    setNodes([...nodes, newNode]);
    setNewNodeValue('');
  };

  const addEdge = () => {
    if (!sourceNode || !targetNode || sourceNode === targetNode) return;
    
    const sourceExists = nodes.some(node => node.value === sourceNode);
    const targetExists = nodes.some(node => node.value === targetNode);
    
    if (!sourceExists || !targetExists) return;
    
    const edgeExists = edges.some(edge => 
      (edge.source === sourceNode && edge.target === targetNode) ||
      (edge.source === targetNode && edge.target === sourceNode)
    );
    
    if (edgeExists) return;
    
    const weight = parseInt(edgeWeight) || 1;
    const newEdge: GraphEdge = {
      source: sourceNode,
      target: targetNode,
      weight: weight,
      status: 'default'
    };
    
    setEdges([...edges, newEdge]);
    setSourceNode('');
    setTargetNode('');
    setEdgeWeight('1');
  };

  const generateExample = () => {
    const exampleNodes: GraphNode[] = [
      { id: '1', value: 'A', x: 150, y: 100, distance: Infinity, status: 'default' },
      { id: '2', value: 'B', x: 350, y: 100, distance: Infinity, status: 'default' },
      { id: '3', value: 'C', x: 100, y: 200, distance: Infinity, status: 'default' },
      { id: '4', value: 'D', x: 250, y: 200, distance: Infinity, status: 'default' },
      { id: '5', value: 'E', x: 400, y: 200, distance: Infinity, status: 'default' }
    ];
    
    const exampleEdges: GraphEdge[] = [
      { source: 'A', target: 'B', weight: 4, status: 'default' },
      { source: 'A', target: 'C', weight: 2, status: 'default' },
      { source: 'B', target: 'D', weight: 3, status: 'default' },
      { source: 'C', target: 'D', weight: 1, status: 'default' },
      { source: 'D', target: 'E', weight: 5, status: 'default' }
    ];
    
    setNodes(exampleNodes);
    setEdges(exampleEdges);
  };

  const eraseGraph = () => {
    setNodes([]);
    setEdges([]);
    setDijkstraSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
  };

  const performDijkstra = () => {
    if (!startNode) return;
    
    const steps: DijkstraStep[] = [];
    const distances: { [key: string]: number } = {};
    const visited = new Set<string>();
    const previous: { [key: string]: string | null } = {};
    
    // Initialize distances
    nodes.forEach(node => {
      distances[node.value] = node.value === startNode ? 0 : Infinity;
      previous[node.value] = null;
    });
    
    // Initial state
    steps.push({
      nodes: nodes.map(node => ({
        ...node,
        distance: distances[node.value],
        status: node.value === startNode ? ('current' as const) : ('default' as const)
      })),
      edges: edges.map(edge => ({ ...edge, status: 'default' as const })),
      description: `Starting Dijkstra from node ${startNode} with distance 0`,
      currentNode: startNode
    });
    
    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let currentNode: string | null = null;
      let minDistance = Infinity;
      
      for (const node of nodes) {
        if (!visited.has(node.value) && distances[node.value] < minDistance) {
          minDistance = distances[node.value];
          currentNode = node.value;
        }
      }
      
      if (currentNode === null || distances[currentNode] === Infinity) break;
      
      visited.add(currentNode);
      
      // Update distances to neighbors
      const neighbors = edges.filter(
        edge => edge.source === currentNode || edge.target === currentNode
      );
      
      let updatedNodes = false;
      neighbors.forEach(edge => {
        const neighbor = edge.source === currentNode ? edge.target : edge.source;
        const newDistance = distances[currentNode!] + edge.weight;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentNode;
          updatedNodes = true;
        }
      });
      
      if (updatedNodes) {
        steps.push({
          nodes: nodes.map(node => ({
            ...node,
            distance: distances[node.value],
            status: node.value === currentNode ? ('current' as const) : 
                   visited.has(node.value) ? ('finalized' as const) : ('default' as const)
          })),
          edges: edges.map(edge => ({
            ...edge,
            status: (edge.source === currentNode || edge.target === currentNode) ? ('active' as const) : ('default' as const)
          })),
          description: `Processing node ${currentNode}, updating neighbor distances`,
          currentNode: currentNode
        });
      }
      
      // Finalize current node
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          distance: distances[node.value],
          status: visited.has(node.value) ? ('finalized' as const) : ('default' as const)
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' as const })),
        description: `Node ${currentNode} finalized with distance ${distances[currentNode]}`,
        currentNode: currentNode
      });
    }
    
    setDijkstraSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const stepForward = () => {
    if (currentStep < dijkstraSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setCurrentDescription('');
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Reset all statuses
    setNodes(nodes.map(node => ({ ...node, status: 'default', distance: Infinity })));
    setEdges(edges.map(edge => ({ ...edge, status: 'default' })));
  };

  useEffect(() => {
    if (isAnimating && dijkstraSteps.length > 0) {
      if (currentStep < dijkstraSteps.length) {
        const step = dijkstraSteps[currentStep];
        setCurrentDescription(step.description);
        setNodes(step.nodes);
        setEdges(step.edges);
        
        animationRef.current = setTimeout(() => {
          if (currentStep < dijkstraSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsAnimating(false);
          }
        }, 2000);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, dijkstraSteps]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'current': return 'fill-yellow-500';
      case 'visiting': return 'fill-orange-500';
      case 'finalized': return 'fill-green-500';
      default: return 'fill-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dijkstra's Algorithm Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={eraseGraph} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Erase Graph
            </Button>
          </div>

          {/* Node and Edge Creation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Add Node</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Node value (e.g., A)"
                  value={newNodeValue}
                  onChange={(e) => setNewNodeValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNode()}
                />
                <Button onClick={addNode} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Add Weighted Edge</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="From"
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                />
                <Input
                  placeholder="To"
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                />
                <Input
                  placeholder="Weight"
                  type="number"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                  className="w-20"
                />
                <Button onClick={addEdge} size="sm">Add</Button>
              </div>
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="space-y-4">
            <div className="flex gap-2 items-center justify-center">
              <Input
                placeholder="Start node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="max-w-32"
              />
              <Button onClick={performDijkstra} size="sm">
                Start Dijkstra
              </Button>
            </div>
          </div>

          {/* Animation Controls */}
          {dijkstraSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={() => setIsAnimating(!isAnimating)} 
                size="sm"
                disabled={currentStep >= dijkstraSteps.length - 1}
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepForward} size="sm" disabled={currentStep >= dijkstraSteps.length - 1}>
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {dijkstraSteps.length}
              </span>
            </div>
          )}

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>🔵 Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>🟡 Current Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>🟠 Distance Updated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>🟢 Finalized Path</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Graph Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-center justify-center overflow-auto">
            {nodes.length > 0 ? (
              <svg width="500" height="300" className="overflow-visible">
                {/* Render edges */}
                {edges.map((edge, idx) => {
                  const sourceNode = nodes.find(n => n.value === edge.source);
                  const targetNode = nodes.find(n => n.value === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={edge.status === 'active' ? '#f97316' : 'currentColor'}
                        strokeWidth={edge.status === 'active' ? '3' : '2'}
                        className="text-muted-foreground"
                      />
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 5}
                        textAnchor="middle"
                        className="text-xs font-bold fill-foreground bg-background"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
                      animate={{ scale: node.status === 'current' ? 1.2 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <text
                      x={node.x}
                      y={node.y - 5}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white"
                    >
                      {node.value}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 8}
                      textAnchor="middle"
                      className="text-xs fill-white"
                    >
                      {node.distance === Infinity ? '∞' : node.distance}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Graph</p>
                <p className="text-sm">Generate an example or add nodes to start</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DijkstraVisualizer;
