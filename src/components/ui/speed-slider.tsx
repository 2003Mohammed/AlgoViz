
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Gauge } from 'lucide-react';

interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedSlider: React.FC<SpeedSliderProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-muted/30" title="Adjust animation speed">
      <div className="flex items-center gap-2 min-w-fit">
        <Gauge className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Speed</span>
      </div>
      
      <div className="flex-1 px-2">
        <Slider
          aria-label="Animation speed"
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          min={0.25}
          max={4}
          step={0.25}
          className="w-full"
        />
      </div>
      
      <div className="min-w-fit">
        <span className="text-sm text-muted-foreground font-mono">
          {speed}x
        </span>
      </div>
    </div>
  );
};
