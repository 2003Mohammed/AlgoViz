
import React from 'react';

interface QueueRendererProps {
  queue: any[];
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({ queue }) => {
  return (
    <div className="flex flex-col items-center">
      {queue.length > 0 ? (
        <>
          <div className="flex justify-between w-full max-w-md mb-2">
            <div className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md">
              Front
            </div>
            <div className="px-2 py-1 text-xs font-medium bg-secondary/50 rounded-md">
              Rear
            </div>
          </div>
          <div className="flex flex-row-reverse items-center justify-center">
            {queue.map((item, index) => (
              <div 
                key={index} 
                className={`w-16 h-12 flex items-center justify-center border border-primary/50 rounded-md mx-1 ${
                  index === 0 ? 'bg-primary/20' : 
                  index === queue.length - 1 ? 'bg-secondary/30' : 
                  'bg-primary/10'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">Queue is empty</div>
      )}
    </div>
  );
};
