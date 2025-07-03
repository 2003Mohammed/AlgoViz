
import React from 'react';
import { Operation } from '../../utils/dataStructureData';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

interface OperationsInfoProps {
  operations: Operation[];
}

export const OperationsInfo: React.FC<OperationsInfoProps> = ({ operations }) => {
  if (operations.length === 0) return null;

  return (
    <motion.div 
      className="bg-muted rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold mb-3">Available Operations</h3>
      <div className="space-y-3">
        {operations.map((operation, index) => (
          <motion.div
            key={operation.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{operation.name}</Badge>
              <span className="text-sm font-medium">{operation.timeComplexity}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {operation.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
