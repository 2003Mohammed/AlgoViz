import React, { useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useLocation } from 'react-router-dom';
import { useTutorContext } from '../context/TutorContext';

interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  {
    label: 'Explain A* Search',
    prompt: 'Explain A* search in simple terms with a small example.'
  },
  {
    label: 'Optimize Visualization',
    prompt: 'Give me 3 quick performance tips for visualizers.'
  },
  {
    label: 'DSA Practice Plan',
    prompt: 'Create a 3-day practice plan for graph algorithms.'
  },
  {
    label: 'Quiz Me',
    prompt: 'Give me a short quiz question about Dijkstra vs A*.'
  }
];

const responseMap: Array<{ match: RegExp; replies: string[] }> = [
  {
    match: /performance|optimi|speed/i,
    replies: [
      'Quick wins: 1) code-split visualizers so only the active module loads, 2) memoize heavy calculations and node rendering, and 3) move heavy pathfinding into Web Workers to keep the UI smooth.',
      'Performance checklist: debounce slider changes, memoize edge lookups, and batch state updates so the DOM redraw happens once per step.',
      'Try: throttle animations at high speeds, precompute neighbor lists, and keep layout data immutable between steps.'
    ]
  },
  {
    match: /practice|plan/i,
    replies: [
      '3-day graph plan: Day 1: BFS/DFS + traversals with small graphs. Day 2: Dijkstra + A* with weighted examples. Day 3: MST algorithms (Prim/Kruskal) and compare complexity tradeoffs.',
      'Study flow: Day 1 focus on BFS/DFS traversal order, Day 2 shortest paths (Dijkstra/A*), Day 3 apply to real maps and compare heuristics.',
      'Plan idea: small graphs first, then medium/large with weights, finishing with a compare-and-contrast of heuristics vs. pure shortest path.'
    ]
  },
  {
    match: /quiz|question/i,
    replies: [
      'Quiz: When will A* behave exactly like Dijkstra? (Answer: when the heuristic h = 0 for all nodes, so f = g.)',
      'Quiz: In Dijkstra, why do finalized nodes never get revisited? (Answer: their shortest distance is already minimal.)',
      'Quiz: BFS uses which data structure to ensure level-order traversal? (Answer: a queue.)'
    ]
  }
];

export const TutorAssistant: React.FC = () => {
  const { visualizationState } = useTutorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi! I\'m your AlgoViz tutor. Ask me about algorithms, request a quiz, or get performance tips.'
    }
  ]);
  const location = useLocation();
  const replyIndex = useRef(0);

  const contextLabel = useMemo(() => {
    const algorithmLabel = visualizationState.algorithmName ? ` → ${visualizationState.algorithmName}` : '';
    if (location.pathname.startsWith('/algorithms/graph/astar')) {
      return `Context: Graph Algorithms → A* Search${algorithmLabel && visualizationState.algorithmName !== 'A* Search' ? algorithmLabel : ''}`;
    }
    if (location.pathname.startsWith('/algorithms/graph')) {
      return `Context: Graph Algorithms${algorithmLabel}`;
    }
    if (location.pathname.startsWith('/algorithms')) {
      return `Context: Algorithms${algorithmLabel}`;
    }
    if (location.pathname.startsWith('/data-structures')) {
      return 'Context: Data Structures';
    }
    return 'Context: Home';
  }, [location.pathname, visualizationState.algorithmName]);

  const activeAlgorithm = useMemo(() => {
    if (visualizationState.algorithmId) {
      return visualizationState.algorithmId;
    }
    if (location.pathname.includes('/algorithms/graph/astar')) return 'astar';
    if (location.pathname.includes('/algorithms/graph/bfs')) return 'bfs';
    if (location.pathname.includes('/algorithms/graph/dfs')) return 'dfs';
    if (location.pathname.includes('/algorithms/graph/dijkstra')) return 'dijkstra';
    return null;
  }, [location.pathname, visualizationState.algorithmId]);

  const getContextSummary = () => {
    if (!visualizationState.totalSteps) {
      return 'No step data yet. Load an example or press Play to generate steps.';
    }

    const stepLabel = `Step ${visualizationState.stepIndex + 1} of ${visualizationState.totalSteps}`;
    const parts = [stepLabel, visualizationState.stepDescription].filter(Boolean);

    if (visualizationState.queue?.length) {
      parts.push(`Queue: [${visualizationState.queue.join(', ')}]`);
    }
    if (visualizationState.stack?.length) {
      parts.push(`Stack: [${visualizationState.stack.join(', ')}]`);
    }
    if (visualizationState.openSet?.length || visualizationState.closedSet?.length) {
      parts.push(`Open: ${visualizationState.openSet?.join(', ') || 'empty'}`);
      parts.push(`Closed: ${visualizationState.closedSet?.join(', ') || 'empty'}`);
    }
    if (visualizationState.path?.length) {
      parts.push(`Path: ${visualizationState.path.join(' → ')}`);
    }

    return parts.join(' • ');
  };

  const getWhyExplanation = () => {
    switch (activeAlgorithm) {
      case 'bfs':
        return 'BFS expands nodes in queue order, so the current node is the earliest discovered node whose neighbors are still pending.';
      case 'dfs':
        return 'DFS dives along the stack, so the current node is the most recently discovered node whose neighbors haven’t been fully explored.';
      case 'dijkstra':
        return 'Dijkstra always picks the unvisited node with the smallest known distance, guaranteeing it is safe to finalize.';
      case 'astar':
        return 'A* picks the node with the lowest f = g + h score, balancing the known cost so far with the estimated distance to the goal.';
      default:
        return 'Each algorithm selects the next node using its own rule (queue, stack, or priority by distance/heuristic).';
    }
  };

  const generateResponse = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    const match = responseMap.find((entry) => entry.match.test(prompt));
    if (match) {
      const reply = match.replies[replyIndex.current % match.replies.length];
      replyIndex.current += 1;
      return reply;
    }

    if (normalized.includes('why') || normalized.includes('reason') || normalized.includes('explain')) {
      return `${getContextSummary()} ${getWhyExplanation()}`;
    }

    if (normalized.includes('current') || normalized.includes('status') || normalized.includes('state')) {
      return getContextSummary();
    }

    if (normalized.includes('a*') || normalized.includes('astar') || normalized.includes('a-star')) {
      return 'A* combines Dijkstra’s guaranteed shortest path with a heuristic that guides the search toward the goal. It scores nodes by f = g + h to prioritize promising paths.';
    }
    if (normalized.includes('dijkstra')) {
      return 'Dijkstra expands nodes in order of smallest known distance, finalizing the shortest path to each node as it goes.';
    }
    if (normalized.includes('bfs')) {
      return 'BFS explores level by level using a queue, guaranteeing the shortest path in unweighted graphs.';
    }
    if (normalized.includes('dfs')) {
      return 'DFS explores depth-first using a stack (or recursion), which is great for reachability and component discovery.';
    }

    const fallbackReplies = [
      'Ask about the current step, or try “Why did it pick this node?” for a context-aware explanation.',
      'I can explain the current visualization state. Ask “What is happening right now?”',
      'Try a targeted question like “Why is this node expanded?” or “What does the queue look like?”'
    ];
    const reply = fallbackReplies[replyIndex.current % fallbackReplies.length];
    replyIndex.current += 1;
    return reply;
  };

  const handleSend = (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: TutorMessage = { role: 'user', content: prompt.trim() };
    const assistantMessage: TutorMessage = {
      role: 'assistant',
      content: generateResponse(prompt)
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="w-[320px] sm:w-[360px] shadow-xl border-primary/30 bg-background/95 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AlgoViz Tutor
              </span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{contextLabel}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-lg p-2 text-xs leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary/10 text-foreground ml-6'
                  }`}
                >
                  <strong className="block mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {message.role === 'assistant' ? 'Tutor' : 'You'}
                  </strong>
                  {message.content}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.label}
                  variant="outline"
                  size="sm"
                  className="text-[11px]"
                  onClick={() => handleSend(prompt.prompt)}
                >
                  {prompt.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the tutor..."
                className="text-xs"
              />
              <Button size="sm" onClick={() => handleSend(input)}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOpen && (
        <Button
          className="rounded-full shadow-lg gap-2 px-4"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-4 w-4" />
          Tutor
          <Sparkles className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
