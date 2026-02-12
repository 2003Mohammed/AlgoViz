import React, { useMemo, useRef, useState } from 'react';
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
  const lastPromptRef = useRef<string>('');

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="w-[320px] sm:w-[360px] shadow-xl border-primary/30 bg-background/95 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AlgoViz Assistant
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
