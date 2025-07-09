
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

type TraversalType = 'bfs' | 'dfs';

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [nodeInput, setNodeInput] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [startNode, setStartNode] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string>('');
  const [traversalResult, setTraversalResult] = useState<string[]>([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(-1);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const traversalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => {
    setError('');
  };

  const generateExample = () => {
    const examples = [
      {
        nodes: [
          { id: 'A', label: 'A', x: 100, y: 100 },
          { id: 'B', label: 'B', x: 200, y: 50 },
          { id: 'C', label: 'C', x: 200, y: 150 },
          { id: 'D', label: 'D', x: 300, y: 100 },
          { id: 'E', label: 'E', x: 400, y: 80 }
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
          { id: '1', label: '1', x: 150, y: 80 },
          { id: '2', label: '2', x: 100, y: 160 },
          { id: '3', label: '3', x: 200, y: 160 },
          { id: '4', label: '4', x: 300, y: 120 },
          { id: '5', label: '5', x: 250, y: 200 }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '4' },
          { source: '3', target: '4' },
          { source: '3', target: '5' },
          { source: '4', target: '5' }
        ]
      }
    ];

    const example = examples[Math.floor(Math.random() * examples.length)];
    
    const newNodes: GraphNode[] = example.nodes.map(node => ({
      ...node,
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
    resetError();
  };

  const eraseExample = () => {
    setNodes([]);
    setEdges([]);
    setTraversalResult([]);
    setCurrentTraversalIndex(-1);
    setStartNode('');
    setLastOperation('Erased graph');
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
    
    // Generate random position
    const x = Math.random() * 300 + 50;
    const y = Math.random() * 200 + 50;

    const newNode: GraphNode = {
      id: label,
      label,
      x,
      y,
      status: 'default'
    };

    setNodes(prev => [...prev, newNode]);
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
    setNodes(prev => prev.filter(node => node.label !== label));
    setEdges(prev => prev.filter(edge => edge.source !== label && edge.target !== label));
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
    setIsTraversing(true);
    setCurrentTraversalIndex(0);

    const visited = new Set<string>();
    const queue = [startNode];
    const result: string[] = [];

    // BFS algorithm
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);

        // Add neighbors to queue
        const neighbors = edges
          .filter(edge => edge.source === current || edge.target === current)
          .map(edge => edge.source === current ? edge.target : edge.source)
          .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));

        queue.push(...neighbors);
      }
    }

    setTraversalResult(result);
    setLastOperation(`BFS traversal: ${result.join(' → ')}`);

    // Animate BFS
    let index = 0;
    const animateStep = () => {
      if (index < result.length) {
        const currentNodeLabel = result[index];
        
        // Mark current node as visiting
        setNodes(prev => prev.map(node => ({
          ...node,
          status: node.label === currentNodeLabel ? 'visiting' : 
                  result.slice(0, index).includes(node.label) ? 'visited' : 'default'
        })));

        // Mark edges as traversed
        if (index > 0) {
          const prevNodeLabel = result[index - 1];
          setEdges(prev => prev.map(edge => ({
            ...edge,
            status: (edge.source === prevNodeLabel && edge.target === currentNodeLabel) ||
                   (edge.source === currentNodeLabel && edge.target === prevNodeLabel) 
                   ? 'traversed' : edge.status
          })));
        }

        setCurrentTraversalIndex(index);
        index++;
        
        if (traversalRef.current) clearTimeout(traversalRef.current);
        traversalRef.current = setTimeout(animateStep, 1000);
      } else {
        setIsTraversing(false);
        setCurrentTraversalIndex(-1);
        
        // Mark all visited nodes
        setNodes(prev => prev.map(node => ({
          ...node,
          status: result.includes(node.label) ? 'visited' : 'default'
        })));
      }
    };

    animateStep();
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
    setIsTraversing(true);
    setCurrentTraversalIndex(0);

    const visited = new Set<string>();
    const result: string[] = [];

    // DFS algorithm (recursive)
    const dfs = (nodeLabel: string) => {
      if (visited.has(nodeLabel)) return;
      
      visited.add(nodeLabel);
      result.push(nodeLabel);

      // Visit neighbors
      const neighbors = edges
        .filter(edge => edge.source === nodeLabel || edge.target === nodeLabel)
        .map(edge => edge.source === nodeLabel ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor));

      neighbors.forEach(neighbor => dfs(neighbor));
    };

    dfs(startNode);
    setTraversalResult(result);
    setLastOperation(`DFS traversal: ${result.join(' → ')}`);

    // Animate DFS
    let index = 0;
    const animateStep = () => {
      if (index < result.length) {
        const currentNodeLabel = result[index];
        
        // Mark current node as visiting
        setNodes(prev => prev.map(node => ({
          ...node,
          status: node.label === currentNodeLabel ? 'visiting' : 
                  result.slice(0, index).includes(node.label) ? 'visited' : 'default'
        })));

        // Mark edges as traversed
        if (index > 0) {
          const prevNodeLabel = result[index - 1];
          setEdges(prev => prev.map(edge => ({
            ...edge,
            status: (edge.source === prevNodeLabel && edge.target === currentNodeLabel) ||
                   (edge.source === currentNodeLabel && edge.target === prevNodeLabel) 
                   ? 'traversed' : edge.status
          })));
        }

        setCurrentTraversalIndex(index);
        index++;
        
        if (traversalRef.current) clearTimeout(traversalRef.current);
        traversalRef.current = setTimeout(animateStep, 1000);
      } else {
        setIsTraversing(false);
        setCurrentTraversalIndex(-1);
        
        // Mark all visited nodes
        setNodes(prev => prev.map(node => ({
          ...node,
          status: result.includes(node.label) ? 'visited' : 'default'
        })));
      }
    };

    animateStep();
  };

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setNodeInput('');
    setEdgeSource('');
    setEdgeTarget('');
    setStartNode('');
    setTraversalResult([]);
    setCurrentTraversalIndex(-1);
    setLastOperation('Graph reset');
    setIsAnimating(false);
    setIsTraversing(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
    if (traversalRef.current) clearTimeout(traversalRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !isAnimating && !isTraversing) {
      action();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (traversalRef.current) clearTimeout(traversalRef.current);
    };
  }, []);

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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
                  disabled={isAnimating || isTraversing}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addNode} disabled={isAnimating || isTraversing || !nodeInput.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="destructive" onClick={removeNode} disabled={isAnimating || isTraversing || !nodeInput.trim()}>
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
                  disabled={isAnimating || isTraversing}
                />
                <Input 
                  placeholder="To" 
                  value={edgeTarget}
                  onChange={(e) => setEdgeTarget(e.target.value)}
                  disabled={isAnimating || isTraversing}
                />
              </div>
              <Button size="sm" onClick={addEdge} disabled={isAnimating || isTraversing || !edgeSource.trim() || !edgeTarget.trim()}>
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
                disabled={isAnimating || isTraversing}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Traversal</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={performBFS} disabled={isAnimating || isTraversing || nodes.length === 0}>
                  <Search className="h-4 w-4 mr-1" />
                  BFS
                </Button>
                <Button size="sm" variant="outline" onClick={performDFS} disabled={isAnimating || isTraversing || nodes.length === 0}>
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
