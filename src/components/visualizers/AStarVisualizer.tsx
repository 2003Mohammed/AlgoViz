import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ExternalLink, Pause, Play, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';
import { useTutorContext } from '../../context/TutorContext';

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

interface GraphExample {
  key: 'small' | 'medium' | 'large';
  label: string;
  startNode: string;
  targetNode: string;
  nodes: Array<Omit<GraphNode, 'status'>>;
  edges: Array<Omit<GraphEdge, 'status'>>;
}

const AStarVisualizer: React.FC = () => {
  const { updateVisualizationState } = useTutorContext();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState<AStarStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDescription, setCurrentDescription] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState([1.5]);
  const [selectedExample, setSelectedExample] = useState<GraphExample['key']>('small');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const examples: GraphExample[] = [
    {
      key: 'small',
      label: 'Small',
      startNode: 'A',
      targetNode: 'F',
      nodes: [
        { id: 'A', x: 120, y: 120 },
        { id: 'B', x: 260, y: 60 },
        { id: 'C', x: 260, y: 180 },
        { id: 'D', x: 420, y: 120 },
        { id: 'E', x: 560, y: 60 },
        { id: 'F', x: 560, y: 180 }
      ],
      edges: [
        { source: 'A', target: 'B', weight: 4 },
        { source: 'A', target: 'C', weight: 3 },
        { source: 'B', target: 'D', weight: 6 },
        { source: 'C', target: 'D', weight: 2 },
        { source: 'B', target: 'E', weight: 5 },
        { source: 'C', target: 'F', weight: 6 },
        { source: 'D', target: 'E', weight: 2 },
        { source: 'D', target: 'F', weight: 4 }
      ]
    },
    {
      key: 'medium',
      label: 'Medium',
      startNode: 'A',
      targetNode: 'H',
      nodes: [
        { id: 'A', x: 100, y: 120 },
        { id: 'B', x: 220, y: 40 },
        { id: 'C', x: 220, y: 200 },
        { id: 'D', x: 360, y: 120 },
        { id: 'E', x: 480, y: 40 },
        { id: 'F', x: 480, y: 200 },
        { id: 'G', x: 620, y: 120 },
        { id: 'H', x: 720, y: 120 }
      ],
      edges: [
        { source: 'A', target: 'B', weight: 3 },
        { source: 'A', target: 'C', weight: 2 },
        { source: 'B', target: 'D', weight: 4 },
        { source: 'C', target: 'D', weight: 3 },
        { source: 'D', target: 'E', weight: 5 },
        { source: 'D', target: 'F', weight: 4 },
        { source: 'E', target: 'G', weight: 3 },
        { source: 'F', target: 'G', weight: 2 },
        { source: 'G', target: 'H', weight: 3 },
        { source: 'C', target: 'F', weight: 6 }
      ]
    },
    {
      key: 'large',
      label: 'Large',
      startNode: 'A',
      targetNode: 'J',
      nodes: [
        { id: 'A', x: 80, y: 120 },
        { id: 'B', x: 200, y: 40 },
        { id: 'C', x: 200, y: 200 },
        { id: 'D', x: 320, y: 120 },
        { id: 'E', x: 440, y: 40 },
        { id: 'F', x: 440, y: 200 },
        { id: 'G', x: 560, y: 120 },
        { id: 'H', x: 680, y: 40 },
        { id: 'I', x: 680, y: 200 },
        { id: 'J', x: 780, y: 120 }
      ],
      edges: [
        { source: 'A', target: 'B', weight: 4 },
        { source: 'A', target: 'C', weight: 3 },
        { source: 'B', target: 'D', weight: 5 },
        { source: 'C', target: 'D', weight: 2 },
        { source: 'D', target: 'E', weight: 4 },
        { source: 'D', target: 'F', weight: 4 },
        { source: 'E', target: 'G', weight: 3 },
        { source: 'F', target: 'G', weight: 2 },
        { source: 'G', target: 'H', weight: 5 },
        { source: 'G', target: 'I', weight: 4 },
        { source: 'H', target: 'J', weight: 3 },
        { source: 'I', target: 'J', weight: 2 },
        { source: 'C', target: 'F', weight: 6 }
      ]
    }
  ];

  const applyExample = (example: GraphExample) => {
    setNodes(example.nodes.map((node) => ({ ...node, status: 'default' })));
    setEdges(example.edges.map((edge) => ({ ...edge, status: 'default' })));
    setSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
    setStartNode(example.startNode);
    setTargetNode(example.targetNode);
    updateVisualizationState({
      algorithmId: 'astar',
      algorithmName: 'A* Search',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'Loaded a new A* example.',
      openSet: [],
      closedSet: [],
      path: []
    });
  };

  const generateRandomExample = () => {
    const nodeCount = selectedExample === 'large' ? 10 : selectedExample === 'medium' ? 8 : 6;
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, nodeCount);
    const centerX = 360;
    const centerY = 130;
    const radius = selectedExample === 'large' ? 200 : selectedExample === 'medium' ? 170 : 140;
    const randomNodes = labels.map((label, index) => {
      const angle = (index / labels.length) * 2 * Math.PI;
      return {
        id: label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        status: 'default' as const
      };
    });

    const randomEdges: GraphEdge[] = [];
    for (let i = 1; i < labels.length; i++) {
      const source = labels[Math.floor(Math.random() * i)];
      const target = labels[i];
      randomEdges.push({ source, target, weight: Math.floor(Math.random() * 8) + 2, status: 'default' });
    }

    const extraEdges = Math.max(2, Math.floor(nodeCount / 2));
    for (let i = 0; i < extraEdges; i++) {
      const source = labels[Math.floor(Math.random() * labels.length)];
      const target = labels[Math.floor(Math.random() * labels.length)];
      if (source === target) continue;
      const exists = randomEdges.some(
        (edge) =>
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source)
      );
      if (!exists) {
        randomEdges.push({
          source,
          target,
          weight: Math.floor(Math.random() * 8) + 2,
          status: 'default'
        });
      }
    }

    setNodes(randomNodes);
    setEdges(randomEdges);
    setSteps([]);
    setCurrentStep(0);
    setCurrentDescription('Random example generated.');
    setIsAnimating(false);
    setIsPaused(false);
    setStartNode(labels[0]);
    setTargetNode(labels[labels.length - 1]);
    updateVisualizationState({
      algorithmId: 'astar',
      algorithmName: 'A* Search',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'Random A* example generated.',
      openSet: [],
      closedSet: [],
      path: []
    });
  };

  useEffect(() => {
    applyExample(examples[0]);
  }, []);

  const reset = () => {
    setNodes((prev) => prev.map((node) => ({ ...node, status: 'default' })));
    setEdges((prev) => prev.map((edge) => ({ ...edge, status: 'default' })));
    setSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
    updateVisualizationState({
      algorithmId: 'astar',
      algorithmName: 'A* Search',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'A* state reset.',
      openSet: [],
      closedSet: [],
      path: []
    });
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
    updateVisualizationState({
      algorithmId: 'astar',
      algorithmName: 'A* Search',
      stepIndex: 0,
      totalSteps: nextSteps.length,
      stepDescription: nextSteps[0]?.description,
      openSet: nextSteps[0]?.openSet ?? [],
      closedSet: nextSteps[0]?.closedSet ?? [],
      path: nextSteps[0]?.path ?? [],
      currentNode: nextSteps[0]?.current
    });
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
        }, animationSpeed[0] * 1000);
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
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);

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
    updateVisualizationState({
      algorithmId: 'astar',
      algorithmName: 'A* Search',
      stepIndex: currentStep,
      totalSteps: steps.length,
      stepDescription: step.description,
      openSet: step.openSet,
      closedSet: step.closedSet,
      path: step.path,
      currentNode: step.current
    });
  }, [currentStep, steps]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>A* (A-Star) Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="sticky top-0 z-20 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg p-3">
            <div className="flex flex-wrap gap-3 items-center justify-center">
            <Button
              onClick={() => {
                const example = examples.find((item) => item.key === selectedExample) ?? examples[0];
                applyExample(example);
              }}
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Load Example
            </Button>
            <Button onClick={generateRandomExample} variant="outline" size="sm">
              Random Example
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

            <div className="flex flex-wrap gap-2 items-center justify-center">
            <span className="text-xs text-muted-foreground">Presets:</span>
            {examples.map((example) => (
              <Button
                key={example.key}
                size="sm"
                variant={selectedExample === example.key ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedExample(example.key);
                  applyExample(example);
                }}
              >
                {example.label}
              </Button>
            ))}
          </div>

            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Animation Speed</span>
              <span className="text-xs text-muted-foreground">{animationSpeed[0].toFixed(1)}s</span>
            </div>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={4}
              min={0.5}
              step={0.1}
              className="flex-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast</span>
              <span>Medium</span>
              <span>Slow</span>
            </div>
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
                <div className="w-3 h-3 bg-viz-node-default rounded-full"></div>
                <span>Open Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-active rounded-full"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-queued rounded-full"></div>
                <span>Closed Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-visited rounded-full"></div>
                <span>Final Path</span>
              </div>
            </div>
          </div>

            {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-viz-panel border border-border rounded-lg text-foreground text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          </div>

          {/* Graph Visualization */}
          <div className="max-w-full overflow-x-auto rounded-lg">
            <div className="bg-muted/20 p-6 rounded-lg min-h-[320px] min-w-[720px] flex items-center justify-center">
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
                        stroke={edge.status === 'path' ? 'hsl(var(--viz-edge-active))' : 'hsl(var(--viz-edge-default))'}
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
                      ? 'hsl(var(--viz-node-visited))'
                      : node.status === 'current'
                        ? 'hsl(var(--viz-node-active))'
                        : node.status === 'open'
                          ? 'hsl(var(--viz-node-default))'
                          : node.status === 'closed'
                            ? 'hsl(var(--viz-node-queued))'
                            : 'hsl(var(--viz-node-default))';

                  const cost = steps[currentStep]?.costs[node.id];

                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="22"
                        fill={nodeColor}
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        animate={{ scale: node.status === 'current' ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="fill-primary-foreground text-sm font-bold"
                      >
                        {node.id}
                      </text>
                      {cost && (
                        <text
                          x={node.x}
                          y={node.y + 24}
                          textAnchor="middle"
                          className="text-[10px] fill-primary-foreground"
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
