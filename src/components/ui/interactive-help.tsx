
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Lightbulb, Code, Play } from 'lucide-react';
import { Button } from './button';

interface HelpContent {
  title: string;
  description: string;
  example?: string;
  tips?: string[];
}

interface InteractiveHelpProps {
  content: HelpContent;
  trigger?: React.ReactNode;
}

export const InteractiveHelp: React.FC<InteractiveHelpProps> = ({ 
  content, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsOpen(true)}
      className="p-2 rounded-full bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary hover:bg-cyber-primary/20 transition-colors"
    >
      <HelpCircle className="h-4 w-4" />
    </motion.button>
  );

  return (
    <>
      {trigger || defaultTrigger}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg cyber-panel relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyber-primary/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-cyber-primary">
                    {content.title}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {content.description}
                </p>

                {content.example && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-cyber-secondary" />
                      <span className="text-sm font-medium text-cyber-secondary">
                        Example
                      </span>
                    </div>
                    <div className="bg-cyber-dark/50 border border-cyber-primary/20 rounded-lg p-3">
                      <code className="text-sm text-cyber-primary font-mono">
                        {content.example}
                      </code>
                    </div>
                  </div>
                )}

                {content.tips && content.tips.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-4 w-4 text-neon-green" />
                      <span className="text-sm font-medium text-neon-green">
                        Pro Tips
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {content.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="cyber-button"
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
