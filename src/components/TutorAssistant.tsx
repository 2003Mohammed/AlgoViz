import React, { useMemo, useState } from 'react';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useLocation } from 'react-router-dom';

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

const responseMap: Array<{ match: RegExp; reply: string }> = [
  {
    match: /a\*|astar|a-star/i,
    reply:
      'A* combines the best of Dijkstra (always expanding the cheapest known path) with a heuristic that estimates the remaining distance. It picks the node with the lowest f = g + h, where g is the path cost so far and h is the estimated cost to the goal. This usually finds the shortest path faster than Dijkstra because it focuses the search toward the target.'
  },
  {
    match: /performance|optimi|speed/i,
    reply:
      'Quick wins: 1) code-split visualizers so only the active module loads, 2) memoize heavy calculations and node rendering, and 3) move expensive pathfinding into Web Workers so the UI stays smooth.'
  },
  {
    match: /practice|plan/i,
    reply:
      '3-day graph plan: Day 1: BFS/DFS + traversals with small graphs. Day 2: Dijkstra + A* with weighted examples. Day 3: MST algorithms (Prim/Kruskal) and compare complexity tradeoffs. End each day with 2 custom inputs.'
  },
  {
    match: /quiz|question/i,
    reply:
      'Quiz: When will A* behave exactly like Dijkstra? (Answer: when the heuristic h = 0 for all nodes, so f = g.)'
  }
];

export const TutorAssistant: React.FC = () => {
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

  const contextLabel = useMemo(() => {
    if (location.pathname.startsWith('/algorithms/graph/astar')) {
      return 'Context: Graph Algorithms → A* Search';
    }
    if (location.pathname.startsWith('/algorithms/graph')) {
      return 'Context: Graph Algorithms';
    }
    if (location.pathname.startsWith('/algorithms')) {
      return 'Context: Algorithms';
    }
    if (location.pathname.startsWith('/data-structures')) {
      return 'Context: Data Structures';
    }
    return 'Context: Home';
  }, [location.pathname]);

  const generateResponse = (prompt: string) => {
    const match = responseMap.find((entry) => entry.match.test(prompt));
    if (match) {
      return match.reply;
    }

    return 'I can help with algorithm explanations, quick quizzes, and optimization tips. Try a prompt like “Explain A* search” or “Give me a DSA practice plan.”';
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
