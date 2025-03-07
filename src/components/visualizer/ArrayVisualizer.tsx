
import React from 'react';
import { ArrayItem } from '../../types/visualizer';
import { getStatusColor } from '../../utils/visualizerUtils';

interface ArrayVisualizerProps {
  array: ArrayItem[];
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ array }) => {
  return (
    <div className="relative h-64 flex items-end justify-center gap-1 mb-6">
      {array.map((item, index) => (
        <div
          key={index}
          className={`w-8 rounded-t-md ${getStatusColor(item.status)} transition-all duration-300`}
          style={{ height: `${(item.value / 100) * 80}%` }}
        >
          <div className="text-xs mt-2 text-center">{item.value}</div>
        </div>
      ))}
    </div>
  );
};
