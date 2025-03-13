
import React from 'react';

interface ArrayRendererProps {
  array: any[];
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({ array }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {array.map((item, index) => (
        <div 
          key={index} 
          className="w-12 h-12 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10"
        >
          {item}
        </div>
      ))}
      {array.length === 0 && (
        <div className="text-muted-foreground">Array is empty</div>
      )}
    </div>
  );
};
