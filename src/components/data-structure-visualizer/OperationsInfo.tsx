
import React from 'react';

interface Operation {
  name: string;
  description: string;
  timeComplexity: string;
}

interface OperationsInfoProps {
  operations: Operation[];
}

export const OperationsInfo: React.FC<OperationsInfoProps> = ({ operations }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4">Operations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {operations.map((operation, index) => (
          <div key={index} className="border border-border/50 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{operation.name}</h4>
              <span className="text-xs px-2 py-1 bg-secondary/30 rounded-full font-mono">
                {operation.timeComplexity}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{operation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
