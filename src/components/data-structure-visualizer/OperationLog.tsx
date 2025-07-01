
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationLogProps {
  logs: string[];
}

export const OperationLog: React.FC<OperationLogProps> = ({ logs }) => {
  return (
    <div className="cyber-panel p-4">
      <h3 className="text-lg font-semibold mb-3 text-primary">Operation Log</h3>
      <ScrollArea className="h-32">
        <AnimatePresence>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-sm text-muted-foreground mb-2 p-2 bg-muted/20 rounded"
              >
                {log}
              </motion.div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No operations performed yet
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};
