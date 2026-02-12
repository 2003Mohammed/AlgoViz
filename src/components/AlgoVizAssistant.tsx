import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useLocation } from 'react-router-dom';
import { useTutorContext } from '../context/TutorContext';
import { routeAssistantResponse } from '../assistant/assistantRouter';

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  {
    label: 'Explain This Topic',
    prompt: 'Explain the current algorithm or data structure in simple terms.'
  },
  {
    label: 'Optimize Visualization',
    prompt: 'Give me optimization guidance for this visualizer.'
  },
  {
    label: 'Compare Approaches',
    prompt: 'Compare this topic with a related algorithm or data structure.'
  },
  {
    label: 'Current State',
    prompt: 'Explain the current step and state details.'
  }
];

const inferAssistantContext = (pathname: string) => {
  if (pathname.includes('bubble-sort')) return { activeAlgorithm: 'bubbleSort', activeDataStructure: null };
  if (pathname.includes('selection-sort')) return { activeAlgorithm: 'selectionSort', activeDataStructure: null };
  if (pathname.includes('insertion-sort')) return { activeAlgorithm: 'insertionSort', activeDataStructure: null };
  if (pathname.includes('merge-sort')) return { activeAlgorithm: 'mergeSort', activeDataStructure: null };
  if (pathname.includes('quick-sort')) return { activeAlgorithm: 'quickSort', activeDataStructure: null };
  if (pathname.includes('heap-sort')) return { activeAlgorithm: 'heapSort', activeDataStructure: null };
  if (pathname.includes('binary-search')) return { activeAlgorithm: 'binarySearch', activeDataStructure: null };
  if (pathname.includes('linear-search')) return { activeAlgorithm: 'linearSearch', activeDataStructure: null };
  if (pathname.includes('/bfs')) return { activeAlgorithm: 'bfs', activeDataStructure: null };
  if (pathname.includes('/dfs')) return { activeAlgorithm: 'dfs', activeDataStructure: null };
  if (pathname.includes('/dijkstra')) return { activeAlgorithm: 'dijkstra', activeDataStructure: null };
  if (pathname.includes('/astar')) return { activeAlgorithm: 'astar', activeDataStructure: null };

  if (pathname.includes('/data-structures/array')) return { activeAlgorithm: null, activeDataStructure: 'array' };
  if (pathname.includes('/data-structures/stack')) return { activeAlgorithm: null, activeDataStructure: 'stack' };
  if (pathname.includes('/data-structures/queue')) return { activeAlgorithm: null, activeDataStructure: 'queue' };
  if (pathname.includes('/data-structures/linked-list')) return { activeAlgorithm: null, activeDataStructure: 'linkedList' };
  if (pathname.includes('/data-structures/tree')) return { activeAlgorithm: null, activeDataStructure: 'tree' };
  if (pathname.includes('/data-structures/graph')) return { activeAlgorithm: null, activeDataStructure: 'graph' };

  return { activeAlgorithm: null, activeDataStructure: null };
};

const PANEL_WIDTH = 360;
const PANEL_HEIGHT = 520;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const AlgoVizAssistant: React.FC = () => {
  const { visualizationState } = useTutorContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi! I am the AlgoViz Assistant. Ask about definitions, current state, complexity, comparisons, implementation, or edge cases.'
    }
  ]);
  const [position, setPosition] = useState(() => {
    if (typeof window === 'undefined') {
      return { x: 16, y: 16 };
    }

    return {
      x: Math.max(16, window.innerWidth - PANEL_WIDTH - 16),
      y: Math.max(16, window.innerHeight - PANEL_HEIGHT - 16)
    };
  });
  const dragStateRef = useRef({ pointerId: -1, offsetX: 0, offsetY: 0 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastPromptRef = useRef<string>('');

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(16, window.innerWidth - PANEL_WIDTH - 16);
        const maxY = Math.max(16, window.innerHeight - PANEL_HEIGHT - 16);
        return {
          x: clamp(prev.x, 16, maxX),
          y: clamp(prev.y, 16, maxY)
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('algoviz-assistant-toggle', handleToggle);
    return () => window.removeEventListener('algoviz-assistant-toggle', handleToggle);
  }, []);

  const { activeAlgorithm, activeDataStructure } = useMemo(
    () => inferAssistantContext(location.pathname),
    [location.pathname]
  );

  const contextLabel = useMemo(() => {
    const algorithmLabel = visualizationState.algorithmName ? ` • ${visualizationState.algorithmName}` : '';

    if (location.pathname.startsWith('/algorithms')) {
      return `Context: Algorithms${algorithmLabel}`;
    }
    if (location.pathname.startsWith('/data-structures')) {
      return `Context: Data Structures${algorithmLabel}`;
    }
    return `Context: ${visualizationState.algorithmName || 'Home'}`;
  }, [location.pathname, visualizationState.algorithmName]);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: AssistantMessage = { role: 'user', content: prompt.trim() };
    const assistantReply = await routeAssistantResponse({
      question: prompt,
      pathname: location.pathname,
      currentRoute: location.pathname,
      activeAlgorithm,
      activeDataStructure,
      visualizationState,
      previousQuestion: lastPromptRef.current
    });

    const assistantMessage: AssistantMessage = {
      role: 'assistant',
      content: assistantReply
    };

    lastPromptRef.current = prompt;
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if ((event.target as HTMLElement).closest('[data-assistant-no-drag="true"]')) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    if (typeof window === 'undefined') return;

    const maxX = Math.max(16, window.innerWidth - PANEL_WIDTH - 16);
    const maxY = Math.max(16, window.innerHeight - PANEL_HEIGHT - 16);
    const nextX = clamp(event.clientX - dragStateRef.current.offsetX, 16, maxX);
    const nextY = clamp(event.clientY - dragStateRef.current.offsetY, 16, maxY);

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;
    dragStateRef.current.pointerId = -1;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      id="algoviz-assistant"
      ref={panelRef}
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isOpen && (
        <Card className="w-[320px] sm:w-[360px] shadow-xl border-primary/30 bg-background/95 backdrop-blur">
          <CardHeader
            className="pb-2 cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AlgoViz Assistant
              </span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} data-assistant-no-drag="true">
                Close
              </Button>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{contextLabel}</p>
          </CardHeader>
          <CardContent className="space-y-3" data-assistant-no-drag="true">
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
                    {message.role === 'assistant' ? 'Assistant' : 'You'}
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
                  onClick={() => {
                    void handleSend(prompt.prompt);
                  }}
                >
                  {prompt.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the assistant..."
                className="text-xs"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void handleSend(input);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  void handleSend(input);
                }}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOpen && (
        <Button className="rounded-full shadow-lg gap-2 px-4" onClick={() => setIsOpen(true)}>
          <MessageCircle className="h-4 w-4" />
          Assistant
          <Sparkles className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
