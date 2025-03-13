
import React from 'react';

interface HashTableRendererProps {
  table: Array<Array<{ key: string; value: any }>>;
}

export const HashTableRenderer: React.FC<HashTableRendererProps> = ({ table }) => {
  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {table.map((bucket, index) => (
        <div 
          key={index}
          className="w-full border border-primary/30 rounded-md mb-2 overflow-hidden"
        >
          <div className="bg-secondary/20 px-3 py-1 border-b border-primary/20">
            <span className="text-xs font-mono">Bucket {index}</span>
          </div>
          <div className="p-2">
            {bucket.length > 0 ? (
              <div className="flex flex-col gap-1">
                {bucket.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center px-2 py-1 bg-primary/5 rounded"
                  >
                    <span className="text-sm font-medium mr-2">{item.key}:</span>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">Empty</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
