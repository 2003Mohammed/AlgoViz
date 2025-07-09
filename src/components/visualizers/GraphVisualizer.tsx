
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Search, RotateCcw, ExternalLink, AlertTriangle, Shuffle, Play, Pause, SkipForward, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: 'default' | 'visiting' | 'visited' | 'current' | 'start' | 'end';
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  status: 'default' | 'traversing' | 'traversed';
}

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [nodeInput, setNodeInput] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [startNode, setStartNode] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [traversalResult, setTraversalResult] = useState<string[]>([]);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => {
    setError('');
  };

  // Auto-position nodes in a circle to avoid overlap
  const calculateNodePositions = (nodeCount: number) => {
    const positions: { x: number, y: number }[] = [];
    const centerX = 250;
    const centerY = 150;
    const radius = Math.min(100, 50 + nodeCount * 10);
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    
    return positions;
  };

  const generateExample = () => {
    const examples = [
      {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
          { id: 'E', label: 'E' }
        ],
        edges: [
          { source: 'A', target: 'B' },
          { source: 'A', target: 'C' },
          { source: 'B', target: 'D' },
          { source: 'C', target: 'D' },
          { source: 'D', target: 'E' }
        ]
      },
      {
        nodes: [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
          { id: '3', label: '3' },
          { id: '4', label: '4' },
          { id: '5', label: '5' },
          { id: '6', label: '6' }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '4' },
          { source: '3', target: '4' },
          { source: '3', target: '5' },
          { source: '4', target: '6' },
          { source: '5', target: '6' }
        ]
      }
    ];

    const example = examples[Math.floor(Math.random() * examples.length)];
    const positions = calculateNodePositions(example.nodes.length);
    
    const newNodes: GraphNode[] = example.nodes.map((node, index) => ({
      ...node,
      x: positions[index].x,
      y: positions[index].y,
      status: 'default'
    }));

    const newEdges: GraphEdge[] = example.edges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      status: 'default'
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(example.nodes[0].id);
    setLastOperation('Generated example graph');
    setAnimationSteps([]);
    setCurrentStep(0);
    setTraversalResult([]);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  const eraseExample = () => {
    setNodes([]);
    setEdges([]);
    setTraversalResult([]);
    setCurrentStep(0);
    setAnimationSteps([]);
    setStartNode('');
    setLastOperation('Erased graph');
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  const addNode = () => {
    const label = nodeInput.trim().toUpperCase();
    if (!label) {
      setError('Please enter a node label');
      return;
    }

    if (nodes.some(node => node.label === label)) {
      setError('Node with this label already exists');
      return;
    }

    resetError();
    
    // Calculate position for new node
    const newNodeCount = nodes.length + 1;
    const positions = calculateNodePositions(newNodeCount);
    
    // Update existing nodes with new positions
    const updatedNodes = nodes.map((node, index) => ({
      ...node,
      x: positions[index].x,
      y: positions[index].y
    }));
    
    // Add new node
    const newNode: GraphNode = {
      id: label,
      label,
      x: positions[nodes.length].x,
      y: positions[nodes.length].y,
      status: 'default'
    };

    setNodes([...updatedNodes, newNode]);
    setNodeInput('');
    setLastOperation(`Added node ${label}`);
  };

  const removeNode = () => {
    const label = nodeInput.trim().toUpperCase();
    if (!label) {
      setError('Please enter a node label to remove');
      return;
    }

    const nodeExists = nodes.some(node => node.label === label);
    if (!nodeExists) {
      setError('Node does not exist');
      return;
    }

    resetError();

    // Remove node and all connected edges
    const remainingNodes = nodes.filter(node => node.label !== label);
    const remainingEdges = edges.filter(edge => edge.source !== label && edge.target !== label);
    
    // Recalculate positions for remaining nodes
    if (remainingNodes.length > 0) {
      const positions = calculateNodePositions(remainingNodes.length);
      const repositionedNodes = remainingNodes.map((node, index) => ({
        ...node,
        x: positions[index].x,
        y: positions[index].y
      }));
      setNodes(repositionedNodes);
    } else {
      setNodes([]);
    }
    
    setEdges(remainingEdges);
    setNodeInput('');
    setLastOperation(`Removed node ${label}`);
  };

  const addEdge = () => {
    const source = edgeSource.trim().toUpperCase();
    const target = edgeTarget.trim().toUpperCase();

    if (!source || !target) {
      setError('Please enter both source and target nodes');
      return;
    }

    if (source === target) {
      setError('Source and target cannot be the same');
      return;
    }

    const sourceExists = nodes.some(node => node.label === source);
    const targetExists = nodes.some(node => node.label === target);

    if (!sourceExists || !targetExists) {
      setError('Both nodes must exist');
      return;
    }

    // Check if edge already exists
    const edgeExists = edges.some(edge => 
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
    );

    if (edgeExists) {
      setError('Edge already exists');
      return;
    }

    resetError();

    const newEdge: GraphEdge = {
      id: `edge-${Date.now()}`,
      source,
      target,
      status: 'default'
    };

    setEdges(prev => [...prev, newEdge]);
    setEdgeSource('');
    setEdgeTarget('');
    setLastOperation(`Added edge ${source} - ${target}`);
  };

  const performBFS = () => {
    if (!startNode) {
      setError('Please select a start node');
      return;
    }

    if (!nodes.some(node => node.label === startNode)) {
      setError('Start node does not exist');
      return;
    }

    resetError();
    
    const visited = new Set<string>();
    const queue = [startNode];
    const result: string[] = [];
    const steps: any[] = [];

    // BFS algorithm with animation steps
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);
        
        // Add step for visiting current node
        steps.push({
          type: 'visit',
          node: current,
          visited: Array.from(visited),
          queue: [...queue]
        });

        // Add neighbors to queue
        const neighbors = edges
          .filter(edge => edge.source === current || edge.target === current)
          .map(edge => edge.source === current ? edge.target : edge.source)
          .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));

        queue.push(...neighbors);
        
        // Add step for exploring neighbors
        if (neighbors.length > 0) {
          steps.push({
            type: 'explore',
            node: current,
            neighbors,
            queue: [...queue]
          });
        }
      }
    }

    setTraversalResult(result);
    setAnimationSteps(steps);
    setCurrentStep(0);
    setLastOperation(`BFS traversal: ${result.join(' → ')}`);
  };

  const performDFS = () => {
    if (!startNode) {
      setError('Please select a start node');
      return;
    }

    if (!nodes.some(node => node.label === startNode)) {
      setError('Start node does not exist');
      return;
    }

    resetError();
    
    const visited = new Set<string>();
    const result: string[] = [];
    const steps: any[] = [];

    // DFS algorithm (recursive) with animation steps
    const dfs = (nodeLabel: string) => {
      if (visited.has(nodeLabel)) return;
      
      visited.add(nodeLabel);
      result.push(nodeLabel);
      
      // Add step for visiting current node
      steps.push({
        type: 'visit',
        node: nodeLabel,
        visited: Array.from(visited)
      });

      // Visit neighbors
      const neighbors = edges
        .filter(edge => edge.source === nodeLabel || edge.target === nodeLabel)
        .map(edge => edge.source === nodeLabel ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor));

      neighbors.forEach(neighbor => {
        steps.push({
          type: 'explore',
          node: nodeLabel,
          neighbor
        });
        dfs(neighbor);
      });
    };

    dfs(startNode);
    setTraversalResult(result);
    setAnimationSteps(steps);
    setCurrentStep(0);
    setLastOperation(`DFS traversal: ${result.join(' → ')}`);
  };

  // Animation controls
  const playAnimation = () => {
    if (animationSteps.length === 0) {
      setError('No animation to play. Try BFS or DFS first.');
      return;
    }
    setIsAnimating(true);
    setIsPaused(false);
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
    setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
    setEdges(prev => prev.map(edge => ({ ...edge, status: 'default' })));
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(currentStep + 1);
          
          // Update node/edge states based on current step
          const step = animationSteps[currentStep + 1];
          if (step) {
            setNodes(prev => prev.map(node => ({
              ...node,
              status: step.visited?.includes(node.label) ? 'visited' as const :
                     step.node === node.label ? 'visiting' as const : 'default' as const
            })));
          }
        }, 1000);
      } else {
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, isPaused, currentStep, animationSteps]);

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setNodeInput('');
    setEdgeSource('');
    setEdgeTarget('');
    setStartNode('');
    setTraversalResult([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setLastOperation('Graph reset');
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !isAnimating) {
      action();
    }
  };

  const getNodeColor = (status: GraphNode['status']) => {
    switch (status) {
      case 'visiting': return 'fill-yellow-500';
      case 'visited': return 'fill-green-500';
      case 'current': return 'fill-blue-500';
      case 'start': return 'fill-purple-500';
      case 'end': return 'fill-red-500';
      default: return 'fill-primary';
    }
  };

  const getEdgeColor = (status: GraphEdge['status']) => {
    switch (status) {
      case 'traversing': return 'stroke-yellow-500';
      case 'traversed': return 'stroke-green-500';
      default: return 'stroke-muted-foreground';
    }
  };

  const renderGraph = () => {
    if (nodes.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Graph</p>
          <p className="text-sm">Add vertices and edges to see visualization</p>
        </div>
      );
    }

    return (
      <svg width="500" height="300" className="mx-auto border rounded-lg bg-background">
        {/* Render edges */}
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={edge.id}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              strokeWidth="2"
              className={getEdgeColor(edge.status)}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
              animate={{ 
                scale: node.status === 'visiting' ? 1.2 : 1,
                opacity: node.status === 'visited' ? 0.8 : 1
              }}
              transition={{ duration: 0.3 }}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="text-sm font-bold fill-primary-foreground"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Example Generation */}
          <div className="flex gap-2 justify-center">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={eraseExample} variant="outline" size="sm">
              Erase Example
            </Button>
          </div>

          {/* Animation Controls */}
          {animationSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={playAnimation} 
                disabled={isAnimating}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button 
                onClick={pauseAnimation} 
                disabled={!isAnimating}
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stepForward} size="sm">
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {animationSteps.length}
              </span>
            </div>
          )}

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add/Remove Vertex</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Node label (A, B, C)" 
                  value={nodeInput}
                  onChange={(e) => setNodeInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addNode)}
                  disabled={isAnimating}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addNode} disabled={isAnimating || !nodeInput.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="destructive" onClick={removeNode} disabled={isAnimating || !nodeInput.trim()}>
                  <Minus className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Edge</label>
              <div className="flex gap-1">
                <Input 
                  placeholder="From" 
                  value={edgeSource}
                  onChange={(e) => setEdgeSource(e.target.value)}
                  disabled={isAnimating}
                />
                <Input 
                  placeholder="To" 
                  value={edgeTarget}
                  onChange={(e) => setEdgeTarget(e.target.value)}
                  disabled={isAnimating}
                />
              </div>
              <Button size="sm" onClick={addEdge} disabled={isAnimating || !edgeSource.trim() || !edgeTarget.trim()}>
                <GitBranch className="h-4 w-4 mr-2" />
                Add Edge
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Node</label>
              <Input 
                placeholder="Start node" 
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                disabled={isAnimating}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Traversal</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={performBFS} disabled={isAnimating || nodes.length === 0}>
                  <Search className="h-4 w-4 mr-1" />
                  BFS
                </Button>
                <Button size="sm" variant="outline" onClick={performDFS} disabled={isAnimating || nodes.length === 0}>
                  <Search className="h-4 w-4 mr-1" />
                  DFS
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <SkipForward className="h-4 w-4" />
              <span className="text-sm">
                <strong>Traversal Result:</strong> {traversalResult.join(' → ')}
              </span>
            </div>
          )}

          {/* Graph Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[350px] flex items-center justify-center">
            {renderGraph()}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Vertices</div>
              <div className="text-lg font-bold">{nodes.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Edges</div>
              <div className="text-lg font-bold">{edges.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Graphs are used in:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Social networks (friends, connections)</li>
                  <li>• GPS and navigation systems</li>
                  <li>• Computer networks and internet</li>
                  <li>• Recommendation systems</li>
                  <li>• Web crawling and indexing</li>
                  <li>• Dependency resolution</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GeeksforGeeks
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complexity & Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>BFS:</span>
                    <span className="font-mono">O(V + E)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>DFS:</span>
                    <span className="font-mono">O(V + E)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Add Vertex:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Add Edge:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advantages:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Models complex relationships</li>
                  <li>• Flexible structure</li>
                  <li>• Powerful algorithms (DFS, BFS)</li>
                  <li>• Real-world problem solving</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraphVisualizer;
