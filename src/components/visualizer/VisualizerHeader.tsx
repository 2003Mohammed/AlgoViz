
import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface VisualizerHeaderProps {
  algorithmName: string;
  onGenerateNewArray: () => void;
  onExportVisualization: () => void;
}

export const VisualizerHeader: React.FC<VisualizerHeaderProps> = ({
  algorithmName,
  onGenerateNewArray,
  onExportVisualization
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold">{algorithmName} Visualization</h3>
      <div className="flex gap-2">
        <Button 
          onClick={onExportVisualization}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button 
          onClick={onGenerateNewArray}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          New Array
        </Button>
      </div>
    </div>
  );
};
