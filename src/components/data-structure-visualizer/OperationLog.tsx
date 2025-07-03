
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationLogProps {
  logs: string[];
}

export const OperationLog: React.FC<OperationLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Operation Log</h3>
        <p className="text-muted-foreground text-sm">
          No operations performed yet. Start interacting with the data structure to see logs here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Operation Log</h3>
      <ScrollArea className="h-32">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-foreground mb-1 p-2 bg-background rounded border-l-2 border-primary"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};
