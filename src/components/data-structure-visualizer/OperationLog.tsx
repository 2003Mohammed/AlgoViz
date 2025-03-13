
import React from 'react';
import { Info } from 'lucide-react';

interface OperationLogProps {
  logs: string[];
}

export const OperationLog: React.FC<OperationLogProps> = ({ logs }) => {
  return (
    <div className="mt-6 p-4 bg-secondary/30 rounded-md max-h-40 overflow-y-auto">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Info className="h-4 w-4" />
        Operation Log
      </h4>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className="text-sm text-muted-foreground"
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
