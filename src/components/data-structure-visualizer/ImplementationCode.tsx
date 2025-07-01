
import React from 'react';
import { Code } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImplementationCodeProps {
  code: string;
}

export const ImplementationCode: React.FC<ImplementationCodeProps> = ({ code }) => {
  return (
    <motion.div 
      className="cyber-panel p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Code className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Implementation</h3>
      </div>
      <div className="bg-muted/20 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
          {code || 'Implementation details will be shown here'}
        </pre>
      </div>
    </motion.div>
  );
};
