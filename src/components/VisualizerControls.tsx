
import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  ChevronRight,
  Settings
} from 'lucide-react';

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  disableBackward: boolean;
  disableForward: boolean;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  currentSpeed,
  disableBackward,
  disableForward
}) => {
  const speeds = [0.5, 1, 1.5, 2];
  
  return (
    <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={onStepBackward}
          disabled={disableBackward}
          className={`p-2 rounded-md transition-colors ${
            disableBackward
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-secondary'
          }`}
          aria-label="Step backward"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        
        <button
          onClick={onStepForward}
          disabled={disableForward}
          className={`p-2 rounded-md transition-colors ${
            disableForward
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-secondary'
          }`}
          aria-label="Step forward"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Speed:</span>
          <div className="flex border rounded-md overflow-hidden">
            {speeds.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-3 py-1.5 text-xs font-medium ${
                  currentSpeed === speed
                    ? 'bg-primary text-white'
                    : 'hover:bg-secondary transition-colors'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
        
        <button
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
