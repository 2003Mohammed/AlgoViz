
import React from 'react';
import { motion } from 'framer-motion';

interface HashTableEntry {
  key: string;
  value: any;
}

interface HashTableStructure {
  buckets: HashTableEntry[][];
  size: number;
}

interface HashTableRendererProps {
  table: HashTableStructure;
}

export const HashTableRenderer: React.FC<HashTableRendererProps> = ({ table }) => {
  const { buckets = [], size = 8 } = table;

  // Create default empty buckets if not provided
  const displayBuckets = Array.from({ length: size }, (_, index) => 
    buckets[index] || []
  );

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <div className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Hash Table (Size: {size})
        </div>
        
        <div className="grid gap-2">
          {displayBuckets.map((bucket, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Bucket index */}
              <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center text-xs font-bold">
                {index}
              </div>
              
              {/* Bucket contents */}
              <div className="flex-1 min-h-8 border-2 border-dashed border-muted rounded-md p-1">
                {bucket.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    Empty
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    {bucket.map((entry, entryIndex) => (
                      <div
                        key={entryIndex}
                        className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
                      >
                        {entry.key}:{entry.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="text-center text-xs text-muted-foreground">
          Each row represents a hash bucket. Collisions are shown as multiple entries in the same bucket.
        </div>
      </div>
    </div>
  );
};
