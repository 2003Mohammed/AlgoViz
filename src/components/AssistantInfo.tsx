import React from 'react';
import { Bot, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const AssistantInfo: React.FC = () => {
  const items = [
    {
      icon: <Bot className="h-5 w-5 text-primary" />,
      title: 'What AlgoViz Assistant Is',
      description: 'A built-in learning guide for data structures and algorithms, available across AlgoViz pages.'
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: 'Deterministic-First Design',
      description: 'It prioritizes deterministic routing and dependable fallback responses for stable, production-safe guidance.'
    },
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: 'AI-Assisted Explanations',
      description: 'When suitable, it can provide deeper explanations while preserving the deterministic response contract.'
    },
    {
      icon: <Compass className="h-5 w-5 text-primary" />,
      title: 'Context-Aware Behavior',
      description: 'Questions are interpreted using your current route and active topic to keep answers focused.'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <Card className="zady-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl pixel-text">About AlgoViz Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.title} className="rounded-lg border border-border/50 bg-background/40 p-4">
                  <div className="mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
