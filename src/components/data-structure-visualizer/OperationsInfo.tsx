
import React from 'react';
import { motion } from 'framer-motion';

interface Operation {
  name: string;
  timeComplexity: string;
  description: string;
}

interface OperationsInfoProps {
  operations: Operation[];
}

export const OperationsInfo: React.FC<OperationsInfoProps> = ({ operations }) => {
  return (
    <div className="cyber-panel p-4">
      <h3 className="text-lg font-semibold mb-3 text-primary">Operations</h3>
      <div className="space-y-3">
        {operations.map((operation, index) => (
          <motion.div
            key={operation.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-muted/20 rounded-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{operation.name}</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                {operation.timeComplexity}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{operation.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
