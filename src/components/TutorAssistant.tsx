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

type QuestionType =
  | 'definition'
  | 'why'
  | 'how'
  | 'what-if'
  | 'navigation-help'
  | 'out-of-context'
  | 'status';

const quickPrompts = [
  {
    label: 'Explain This Topic',
    prompt: 'Explain the current algorithm or data structure in simple terms.'
  },
  {
    label: 'Optimize Visualization',
    prompt: 'Give me 3 quick performance tips for visualizers.'
  },
  {
    label: 'DSA Practice Plan',
    prompt: 'Create a 3-day practice plan covering algorithms and data structures.'
  },
  {
    label: 'Quiz Me',
    prompt: 'Give me a short quiz question about Dijkstra vs A*.'
  }
];


const topicPatterns: Array<{ match: RegExp; answer: string; why: string }> = [
  { match: /array/i, answer: 'An array stores elements in contiguous order and gives fast indexed access.', why: 'Arrays are the baseline structure for many algorithms, especially sorting and binary search.' },
  { match: /linked\s*list/i, answer: 'A linked list stores nodes connected by pointers, making insertion/removal flexible.', why: 'It highlights pointer-based tradeoffs versus array indexing.' },
  { match: /stack/i, answer: 'A stack is LIFO: the most recently added item is removed first.', why: 'Stacks are core for recursion, parsing, and backtracking workflows.' },
  { match: /queue/i, answer: 'A queue is FIFO: items are processed in arrival order.', why: 'Queues model level-order and scheduling behavior (like BFS).' },
  { match: /tree|binary\s*tree/i, answer: 'A tree is a hierarchical structure of parent-child relationships without cycles.', why: 'Trees power efficient search/indexing patterns and recursive reasoning.' },
  { match: /hash|hash\s*table/i, answer: 'A hash table maps keys to buckets for near-constant-time lookups on average.', why: 'It is one of the most practical structures for fast membership and dictionary operations.' },
  { match: /bubble\s*sort/i, answer: 'Bubble sort repeatedly swaps adjacent out-of-order elements.', why: 'It is simple for learning swaps and passes, even though it is inefficient for large inputs.' },
  { match: /selection\s*sort/i, answer: 'Selection sort repeatedly chooses the smallest remaining element and places it next.', why: 'It clarifies in-place selection logic and predictable swap counts.' },
  { match: /insertion\s*sort/i, answer: 'Insertion sort grows a sorted prefix by inserting one element at a time.', why: 'It performs well on small or nearly sorted data and explains incremental ordering well.' },
  { match: /merge\s*sort/i, answer: 'Merge sort divides the data, sorts subarrays recursively, then merges them.', why: 'It demonstrates divide-and-conquer with reliable O(n log n) performance.' },
  { match: /quick\s*sort/i, answer: 'Quick sort partitions around a pivot, then recursively sorts each side.', why: 'It is often fast in practice and teaches partition-based recursion.' },
  { match: /heap\s*sort|heap/i, answer: 'Heap sort uses a heap to repeatedly extract the maximum/minimum element in order.', why: 'It ties priority-queue structure to deterministic O(n log n) sorting.' },
  { match: /binary\s*search/i, answer: 'Binary search halves the search space each step on sorted data.', why: 'It is a classic logarithmic-time strategy and a key algorithmic pattern.' },
  { match: /linear\s*search/i, answer: 'Linear search checks elements one by one until a match is found.', why: 'It is universal (works on unsorted data) and a baseline for comparison.' },
  { match: /bfs|breadth/i, answer: 'BFS explores graph levels outward using a queue.', why: 'It finds shortest paths in unweighted graphs and reveals layer-by-layer expansion.' },
  { match: /dfs|depth/i, answer: 'DFS explores deeply before backtracking, usually with a stack or recursion.', why: 'It is useful for traversal, connectivity checks, and recursive graph/tree logic.' },
  { match: /dijkstra/i, answer: 'Dijkstra picks the lowest known distance next to build shortest paths with non-negative weights.', why: 'It formalizes greedy shortest-path guarantees in weighted graphs.' },
  { match: /a\*|astar|a-star/i, answer: 'A* ranks nodes by f = g + h, combining known cost and heuristic estimate.', why: 'It can reduce search effort while preserving optimality with a good admissible heuristic.' }
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
      '3-day DSA plan: Day 1 sorting + searching basics, Day 2 graph traversals and shortest-path intuition, Day 3 core data structures (stack/queue/tree/hash) with mixed problems.',
      'Study flow: start with fundamentals (array/linked list/stack/queue), then sorting/searching, then graph/tree problems with complexity comparisons.',
      'Plan idea: short daily concept review + 2 implementation problems + 1 compare-and-contrast question (tradeoffs and complexity).'
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
  const lastPromptRef = useRef('');
  const lastQuestionTypeRef = useRef<QuestionType | null>(null);

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

  const currentTopic = useMemo(() => {
    if (visualizationState.algorithmName) return visualizationState.algorithmName;

    const segments = location.pathname.split('/').filter(Boolean);
    const slug = segments[segments.length - 1];
    if (!slug) return 'this page';

    return slug
      .replace(/-/g, ' ')
      .replace(/\w/g, (c) => c.toUpperCase());
  }, [location.pathname, visualizationState.algorithmName]);

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

  const getStateDetails = () => {
    const details: string[] = [];

    if (visualizationState.currentNode) {
      details.push(`Current node: ${visualizationState.currentNode}`);
    }
    if (visualizationState.queue?.length) {
      details.push(`Queue front: ${visualizationState.queue[0]}`);
    }
    if (visualizationState.stack?.length) {
      details.push(`Stack top: ${visualizationState.stack[visualizationState.stack.length - 1]}`);
    }
    if (visualizationState.path?.length) {
      details.push(`Active path: ${visualizationState.path.join(' → ')}`);
    }
    if (visualizationState.distances && visualizationState.currentNode) {
      const distance = visualizationState.distances[visualizationState.currentNode];
      if (typeof distance === 'number') {
        details.push(`Distance(${visualizationState.currentNode}) = ${distance}`);
      }
    }

    return details.join(' • ');
  };

  const buildStructuredResponse = (direct: string, whyMatters: string, next?: string) => {
    const sections = [`Direct answer: ${direct}`, `Why it matters: ${whyMatters}`];
    if (next) {
      sections.push(`Related insight: ${next}`);
    }
    return sections.join('\n\n');
  };

  const classifyQuestion = (prompt: string): QuestionType => {
    const normalized = prompt.toLowerCase().trim();

    if (/current|status|state|step|where are we|what is happening/.test(normalized)) {
      return 'status';
    }
    if (/where|navigate|use this page|how do i use|help me use|controls|button|play|pause|step/.test(normalized)) {
      return 'navigation-help';
    }
    if (/what if|if i change|suppose|instead/.test(normalized)) {
      return 'what-if';
    }
    if (/why|reason/.test(normalized)) {
      return 'why';
    }
    if (/how|steps to|walk me through/.test(normalized)) {
      return 'how';
    }
    if (/what is|define|meaning of/.test(normalized)) {
      return 'definition';
    }

    const dsaSignals = /algorithm|data\s*structure|graph|tree|node|edge|queue|stack|path|heuristic|dijkstra|a\*|astar|bfs|dfs|search|visualization|array|linked\s*list|hash|sorting|quick\s*sort|merge\s*sort|bubble\s*sort|insertion\s*sort|selection\s*sort|heap\s*sort|binary\s*search|linear\s*search|complexity|big\s*o|time\s*complexity|space\s*complexity/;
    const offTopicSignals = /weather|horoscope|stock|crypto|politics|movie|song|recipe|travel|sports\b|football|cricket|basketball|news/;

    if (offTopicSignals.test(normalized) && !dsaSignals.test(normalized)) {
      return 'out-of-context';
    }

    if (!dsaSignals.test(normalized) && !location.pathname.startsWith('/algorithms') && !location.pathname.startsWith('/data-structures')) {
      return 'out-of-context';
    }

    return 'definition';
  };

  const isSimilarPrompt = (prompt: string) => {
    const normalized = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const previous = lastPromptRef.current.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    if (!normalized || !previous) return false;
    if (normalized === previous || normalized.includes(previous) || previous.includes(normalized)) {
      return true;
    }

    const currentWords = new Set(normalized.split(/\s+/));
    const previousWords = new Set(previous.split(/\s+/));
    let overlap = 0;
    currentWords.forEach((word) => {
      if (previousWords.has(word)) overlap += 1;
    });
    return overlap >= Math.min(4, Math.floor(currentWords.size * 0.7));
  };

  const getWhyExplanation = () => {
    switch (activeAlgorithm) {
      case 'bfs':
        return 'BFS expands nodes in queue order, so the current node is the earliest discovered node whose neighbors are still pending.';
      case 'dfs':
        return 'DFS dives along the stack, so the current node is the most recently discovered node whose neighbors have not been fully explored.';
      case 'dijkstra':
        return 'Dijkstra always picks the unvisited node with the smallest known distance, guaranteeing it is safe to finalize.';
      case 'astar':
        return 'A* picks the node with the lowest f = g + h score, balancing known cost with estimated remaining distance.';
      default:
        if (location.pathname.startsWith('/algorithms/sorting')) {
          return 'Sorting algorithms repeatedly enforce ordering rules so each step moves the data closer to sorted order.';
        }
        if (location.pathname.includes('search')) {
          return 'Search algorithms narrow where the target can be by using either order information or systematic traversal.';
        }
        if (location.pathname.startsWith('/data-structures')) {
          return 'Data-structure operations matter because each structure optimizes different tradeoffs like access, insertion, and deletion.';
        }
        return 'Each topic uses a specific rule to choose the next operation or state transition.';
    }
  };

  const generateResponse = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    const questionType = classifyQuestion(prompt);
    const contextSummary = getContextSummary();
    const stateDetails = getStateDetails();
    const repeatedQuestion = isSimilarPrompt(prompt) && lastQuestionTypeRef.current === questionType;

    if (questionType === 'out-of-context') {
      return buildStructuredResponse(
        'I can’t help with unrelated topics here, but I can definitely help with this visualization and algorithms.',
        'Keeping answers tied to the active algorithm makes the guidance accurate and useful while you learn.',
        'Try one of these: • Explain current step • Compare algorithms • Explain algorithm theory • Help using this page'
      );
    }

    if (questionType === 'navigation-help') {
      const algorithmName = visualizationState.algorithmName || 'this algorithm';
      return buildStructuredResponse(
        `Use the control bar to Play/Pause, Step, adjust Speed, and switch Presets for ${algorithmName}.`,
        'These controls let you slow down or isolate key moments so each state transition is easier to understand.',
        'If you want, ask “Explain current step” after pressing Step to get contextual guidance.'
      );
    }

    const match = responseMap.find((entry) => entry.match.test(prompt));
    if (match) {
      const reply = match.replies[replyIndex.current % match.replies.length];
      replyIndex.current += 1;
      return buildStructuredResponse(
        reply,
        'Consistent practice and performance awareness make algorithm intuition stronger over time.',
        'I can also connect this advice to your current step if you ask about the active state.'
      );
    }

    const topicMatch = topicPatterns.find((entry) => entry.match.test(normalized));

    if (questionType === 'status') {
      return buildStructuredResponse(
        `${contextSummary}${stateDetails ? ` • ${stateDetails}` : ''}`,
        'Reading the current state helps you map each visual change to the exact algorithm decision.',
        'Next, ask “Why this node?” to connect the state to the selection rule.'
      );
    }

    if (topicMatch && questionType === 'definition') {
      return buildStructuredResponse(
        topicMatch.answer,
        topicMatch.why,
        repeatedQuestion
          ? `Expanded context: ${contextSummary}`
          : `If helpful, I can connect this to ${currentTopic} and the current visualization state.`
      );
    }

    if (normalized.includes('a*') || normalized.includes('astar') || normalized.includes('a-star')) {
      return buildStructuredResponse(
        'A* combines shortest-known cost (g) with a goal estimate (h), ranking nodes by f = g + h.',
        'This usually reaches the goal faster than uninformed search while still allowing optimal paths with an admissible heuristic.',
        repeatedQuestion
          ? 'Deeper note: if h is always 0, A* behaves like Dijkstra because f becomes g only.'
          : 'Related: ask for a side-by-side comparison with Dijkstra on this graph.'
      );
    }
    if (normalized.includes('dijkstra')) {
      return buildStructuredResponse(
        'Dijkstra always expands the unvisited node with the smallest known distance.',
        'That greedy rule is what guarantees finalized nodes already have optimal shortest-path distances.',
        repeatedQuestion
          ? 'Deeper note: this guarantee requires non-negative edge weights.'
          : 'Related: ask how Dijkstra differs from BFS on weighted graphs.'
      );
    }
    if (normalized.includes('bfs')) {
      return buildStructuredResponse(
        'BFS explores nodes level by level using a queue.',
        'Level-order traversal guarantees the shortest path by edge count in unweighted graphs.',
        repeatedQuestion
          ? 'Deeper note: BFS is effectively Dijkstra where all edge weights are equal.'
          : 'Related: ask which nodes are queued next in the current step.'
      );
    }
    if (normalized.includes('dfs')) {
      return buildStructuredResponse(
        'DFS explores as deep as possible before backtracking, typically via stack or recursion.',
        'That behavior is useful for reachability, connected components, and topological-style reasoning.',
        repeatedQuestion
          ? 'Deeper note: traversal order depends on neighbor ordering and can change discovered paths.'
          : 'Related: ask what is currently on the stack in this run.'
      );
    }

    if (questionType === 'why') {
      return buildStructuredResponse(
        `${getWhyExplanation()} ${stateDetails ? `(${stateDetails})` : ''}`,
        'Understanding the selection rule helps you predict each next move instead of memorizing outputs.',
        repeatedQuestion
          ? `Deeper step insight: ${contextSummary}`
          : 'You can ask “what if we start from another node?” to explore different runs.'
      );
    }

    if (questionType === 'how') {
      return buildStructuredResponse(
        `${currentTopic} progresses through state changes one step at a time. ${contextSummary}`,
        'Stepwise reasoning helps you connect implementation details to behavior and complexity tradeoffs.',
        'Use Step mode to inspect each transition and ask me for explanations at each point.'
      );
    }

    if (questionType === 'what-if') {
      return buildStructuredResponse(
        'Changing inputs (size, ordering, start/target values, or structure shape) can produce different execution paths and outcomes.',
        'What-if analysis builds intuition for algorithm robustness and edge-case behavior.',
        `Try a different preset/input, then compare with the current run at ${contextSummary}.`
      );
    }

    if (questionType === 'definition') {
      return buildStructuredResponse(
        `${currentTopic} uses a clear rule to decide the next operation or state transition.`,
        'Knowing the core definition makes each animation step meaningful rather than just visual.',
        repeatedQuestion
          ? `Expanded context: ${contextSummary}`
          : 'Ask “why this step?” for a contextual explanation tied to the active state.'
      );
    }

    const fallbackReplies = [
      'Ask about the current step, or try “Why did it pick this node?” for a context-aware explanation.',
      'I can explain the current visualization state. Ask “What is happening right now?”',
      'Try a targeted question like “Why is this node expanded?” or “What does the queue look like?”'
    ];
    const reply = fallbackReplies[replyIndex.current % fallbackReplies.length];
    replyIndex.current += 1;
    return buildStructuredResponse(
      reply,
      'Targeted questions tied to the current state produce the most helpful tutoring.',
      'Try: “Explain current step”, “Why this node?”, or “Compare with Dijkstra.”'
    );
  };

  const handleSend = (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: TutorMessage = { role: 'user', content: prompt.trim() };
    const assistantMessage: TutorMessage = {
      role: 'assistant',
      content: generateResponse(prompt)
    };

    lastPromptRef.current = prompt;
    lastQuestionTypeRef.current = classifyQuestion(prompt);

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
