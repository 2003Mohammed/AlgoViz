
import React from 'react';
import { motion } from 'framer-motion';

interface HashTableRendererProps {
  table: Array<Array<{ key: string; value: any }>>;
}

export const HashTableRenderer: React.FC<HashTableRendererProps> = ({ table }) => {
  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {table.map((bucket, index) => (
        <motion.div 
          key={index}
          className="w-full border border-primary/30 rounded-md mb-2 overflow-hidden bg-gradient-to-r from-background to-muted/20"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderColor: "hsl(var(--primary) / 0.5)"
          }}
        >
          <div className="bg-secondary/20 px-3 py-1 border-b border-primary/20">
            <span className="text-xs font-mono">Bucket {index}</span>
          </div>
          <div className="p-2">
            {bucket.length > 0 ? (
              <div className="flex flex-col gap-1">
                {bucket.map((item, itemIndex) => (
                  <motion.div 
                    key={itemIndex}
                    className="flex items-center px-2 py-1 bg-primary/5 rounded"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + itemIndex * 0.05 }}
                    whileHover={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
                  >
                    <span className="text-sm font-medium mr-2">{item.key}:</span>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">Empty</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
