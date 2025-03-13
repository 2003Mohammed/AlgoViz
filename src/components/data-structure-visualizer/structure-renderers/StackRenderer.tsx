
import React from 'react';

interface StackRendererProps {
  stack: any[];
}

export const StackRenderer: React.FC<StackRendererProps> = ({ stack }) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      {stack.length > 0 ? (
        <>
          <div className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mb-2">
            Top
          </div>
          {stack.map((item, index) => (
            <div 
              key={index} 
              className={`w-24 h-12 flex items-center justify-center border border-primary/50 rounded-md ${
                index === 0 ? 'bg-primary/20' : 'bg-primary/10'
              }`}
            >
              {item}
            </div>
          ))}
          <div className="border-b-2 border-primary/50 w-32 mt-1"></div>
        </>
      ) : (
        <div className="text-muted-foreground">Stack is empty</div>
      )}
    </div>
  );
};
