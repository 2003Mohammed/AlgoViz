import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ExternalLink, Pause, Play, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status: 'default' | 'open' | 'closed' | 'current' | 'path';
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  status: 'default' | 'path';
}

interface AStarStep {
  openSet: string[];
  closedSet: string[];
  current: string;
  path: string[];
  costs: Record<string, { g: number; h: number; f: number }>;
  description: string;
}

const AStarVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState<AStarStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const defaultGraph = () => {
    const exampleNodes: GraphNode[] = [
      { id: 'A', x: 120, y: 120, status: 'default' },
      { id: 'B', x: 260, y: 60, status: 'default' },
      { id: 'C', x: 260, y: 180, status: 'default' },
      { id: 'D', x: 420, y: 120, status: 'default' },
      { id: 'E', x: 560, y: 60, status: 'default' },
      { id: 'F', x: 560, y: 180, status: 'default' }
    ];

    const exampleEdges: GraphEdge[] = [
      { source: 'A', target: 'B', weight: 4, status: 'default' },
      { source: 'A', target: 'C', weight: 3, status: 'default' },
      { source: 'B', target: 'D', weight: 6, status: 'default' },
      { source: 'C', target: 'D', weight: 2, status: 'default' },
      { source: 'B', target: 'E', weight: 5, status: 'default' },
      { source: 'C', target: 'F', weight: 6, status: 'default' },
      { source: 'D', target: 'E', weight: 2, status: 'default' },
      { source: 'D', target: 'F', weight: 4, status: 'default' }
    ];

    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
  };

  useEffect(() => {
    defaultGraph();
  }, []);

  const reset = () => {
    setNodes((prev) => prev.map((node) => ({ ...node, status: 'default' })));
    setEdges((prev) => prev.map((edge) => ({ ...edge, status: 'default' })));
    setSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
  };

  const heuristic = (nodeId: string, targetId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    const target = nodes.find((n) => n.id === targetId);
    if (!node || !target) return 0;
    const dx = node.x - target.x;
    const dy = node.y - target.y;
    return Math.sqrt(dx * dx + dy * dy) / 40;
  };

  const getNeighbors = (nodeId: string) => {
    return edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => {
        const neighbor = edge.source === nodeId ? edge.target : edge.source;
        return { id: neighbor, weight: edge.weight };
      });
  };

  const reconstructPath = (cameFrom: Record<string, string | null>, current: string) => {
    const path = [current];
    let cursor = current;
    while (cameFrom[cursor]) {
      cursor = cameFrom[cursor]!;
      path.unshift(cursor);
    }
    return path;
  };

  const generateSteps = () => {
    if (!startNode || !targetNode || startNode === targetNode) {
      alert('Please choose different start and target nodes.');
      return;
    }

    const availableNodes = nodes.map((node) => node.id);
    if (!availableNodes.includes(startNode) || !availableNodes.includes(targetNode)) {
      alert('Start or target node does not exist in the graph.');
      return;
    }

    const openSet = new Set<string>([startNode]);
    const closedSet = new Set<string>();
    const cameFrom: Record<string, string | null> = {};
    const costs: Record<string, { g: number; h: number; f: number }> = {};

    nodes.forEach((node) => {
      const h = heuristic(node.id, targetNode);
      costs[node.id] = { g: Number.POSITIVE_INFINITY, h, f: Number.POSITIVE_INFINITY };
      cameFrom[node.id] = null;
    });
    costs[startNode].g = 0;
    costs[startNode].f = costs[startNode].h;

    const nextSteps: AStarStep[] = [
      {
        openSet: Array.from(openSet),
        closedSet: [],
        current: '',
        path: [],
        costs: { ...costs },
        description: `Starting A* search from ${startNode} toward ${targetNode}.`
      }
    ];

    while (openSet.size > 0) {
      const current = Array.from(openSet).reduce((lowest, nodeId) => {
        return costs[nodeId].f < costs[lowest].f ? nodeId : lowest;
      }, Array.from(openSet)[0]);

      if (current === targetNode) {
        const path = reconstructPath(cameFrom, current);
        nextSteps.push({
          openSet: Array.from(openSet),
          closedSet: Array.from(closedSet),
          current,
          path,
          costs: { ...costs },
          description: `Target found! Path: ${path.join(' → ')}.`
        });
        break;
      }

      openSet.delete(current);
      closedSet.add(current);

      nextSteps.push({
        openSet: Array.from(openSet),
        closedSet: Array.from(closedSet),
        current,
        path: [],
        costs: { ...costs },
        description: `Evaluating node ${current} with lowest f-cost.`
      });

      const neighbors = getNeighbors(current);
      neighbors.forEach((neighbor) => {
        if (closedSet.has(neighbor.id)) return;

        const tentativeG = costs[current].g + neighbor.weight;
        if (tentativeG < costs[neighbor.id].g) {
          cameFrom[neighbor.id] = current;
          costs[neighbor.id] = {
            g: tentativeG,
            h: costs[neighbor.id].h,
            f: tentativeG + costs[neighbor.id].h
          };
          openSet.add(neighbor.id);
        }
      });

      nextSteps.push({
        openSet: Array.from(openSet),
        closedSet: Array.from(closedSet),
        current,
        path: [],
        costs: { ...costs },
        description: `Updated neighbors of ${current}. Open set now: ${Array.from(openSet).join(', ') || 'empty'}.`
      });
    }

    if (openSet.size === 0) {
      nextSteps.push({
        openSet: [],
        closedSet: Array.from(closedSet),
        current: '',
        path: [],
        costs: { ...costs },
        description: 'No path found with A*.'
      });
    }

    setSteps(nextSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (steps.length === 0) {
      generateSteps();
    } else {
      setIsAnimating(!isAnimating);
      setIsPaused(!isPaused);
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (isAnimating && !isPaused && steps.length > 0) {
      if (currentStep < steps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 1500);
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
  }, [isAnimating, isPaused, currentStep, steps]);

  useEffect(() => {
    if (steps.length === 0) return;
    const step = steps[currentStep];
    setCurrentDescription(step.description);

    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: step.path.includes(node.id)
          ? 'path'
          : node.id === step.current
            ? 'current'
            : step.openSet.includes(node.id)
              ? 'open'
              : step.closedSet.includes(node.id)
                ? 'closed'
                : 'default'
      }))
    );

    setEdges((prev) =>
      prev.map((edge) => {
        const isPathEdge = step.path.some((nodeId, index) => {
          const nextNode = step.path[index + 1];
          if (!nextNode) return false;
          return (
            (edge.source === nodeId && edge.target === nextNode) ||
            (edge.source === nextNode && edge.target === nodeId)
          );
        });
        return { ...edge, status: isPathEdge ? 'path' : 'default' };
      })
    );
  }, [currentStep, steps]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>A* (A-Star) Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <Button onClick={defaultGraph} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Load Example
            </Button>
            <Button onClick={togglePlayPause} size="sm">
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={stepForward} disabled={currentStep >= steps.length - 1} size="sm">
              <SkipForward className="h-4 w-4 mr-2" />
              Step
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Input
              placeholder="Start Node"
              value={startNode}
              onChange={(event) => setStartNode(event.target.value.toUpperCase())}
              className="w-32"
            />
            <Input
              placeholder="Target Node"
              value={targetNode}
              onChange={(event) => setTargetNode(event.target.value.toUpperCase())}
              className="w-32"
            />
          </div>

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Open Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Closed Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Final Path</span>
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
          <div className="bg-muted/20 p-6 rounded-lg min-h-[320px] flex items-center justify-center">
            {nodes.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">No Graph</p>
                <p className="text-sm">Load the example to start</p>
              </div>
            ) : (
              <svg width="700" height="260" className="overflow-visible">
                {edges.map((edge, index) => {
                  const sourceNode = nodes.find((node) => node.id === edge.source);
                  const targetNode = nodes.find((node) => node.id === edge.target);
                  if (!sourceNode || !targetNode) return null;
                  return (
                    <g key={`${edge.source}-${edge.target}-${index}`}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={edge.status === 'path' ? '#10b981' : '#6b7280'}
                        strokeWidth={edge.status === 'path' ? 3 : 2}
                      />
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 6}
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {nodes.map((node) => {
                  const nodeColor =
                    node.status === 'path'
                      ? '#10b981'
                      : node.status === 'current'
                        ? '#f59e0b'
                        : node.status === 'open'
                          ? '#60a5fa'
                          : node.status === 'closed'
                            ? '#8b5cf6'
                            : '#6b7280';

                  const cost = steps[currentStep]?.costs[node.id];

                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="22"
                        fill={nodeColor}
                        stroke="#fff"
                        strokeWidth="2"
                        animate={{ scale: node.status === 'current' ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="text-white text-sm font-bold"
                      >
                        {node.id}
                      </text>
                      {cost && (
                        <text
                          x={node.x}
                          y={node.y + 24}
                          textAnchor="middle"
                          className="text-[10px] fill-white"
                        >
                          f:{cost.f === Number.POSITIVE_INFINITY ? '∞' : cost.f.toFixed(1)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Time Complexity:</span>
                <span className="font-mono">O(E log V)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(V)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Pathfinding in maps and games</li>
              <li>• Navigation routing with heuristics</li>
              <li>• Robotics planning</li>
              <li>• AI problem solving</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="https://www.geeksforgeeks.org/a-search-algorithm/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                GeeksforGeeks - A* Search Algorithm
              </a>
            </li>
            <li>
              <a
                href="https://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Red Blob Games - A* Guide
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AStarVisualizer;
