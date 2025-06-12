
import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap } from 'lucide-react';

interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const SpeedSlider: React.FC<SpeedSliderProps> = ({
  speed,
  onSpeedChange,
  min = 0.25,
  max = 4,
  step = 0.25
}) => {
  const getSpeedLabel = (value: number) => {
    if (value <= 0.5) return 'Slow';
    if (value <= 1) return 'Normal';
    if (value <= 2) return 'Fast';
    return 'Turbo';
  };

  const getSpeedColor = (value: number) => {
    if (value <= 0.5) return 'text-blue-400';
    if (value <= 1) return 'text-green-400';
    if (value <= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-3 p-4 cyber-panel">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-cyber-primary" />
        <span className="text-sm font-medium text-cyber-primary">Speed</span>
      </div>
      
      <div className="flex-1 relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-cyber-dark rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, 
              #00f3ff 0%, 
              #00f3ff ${((speed - min) / (max - min)) * 100}%, 
              #1a1a2e ${((speed - min) / (max - min)) * 100}%, 
              #1a1a2e 100%)`
          }}
        />
        
        {/* Speed markers */}
        <div className="absolute top-3 left-0 right-0 flex justify-between px-1">
          {[0.25, 0.5, 1, 2, 4].map((value) => (
            <motion.div
              key={value}
              className={`w-1 h-1 rounded-full ${
                value <= speed ? 'bg-cyber-primary' : 'bg-muted'
              }`}
              animate={{
                scale: value === speed ? 1.5 : 1,
                boxShadow: value === speed ? '0 0 8px rgba(0, 243, 255, 0.8)' : 'none'
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 min-w-[80px]">
        <motion.div
          animate={{ rotate: speed > 2 ? 360 : 0 }}
          transition={{ duration: 1, repeat: speed > 2 ? Infinity : 0 }}
        >
          <Zap className={`h-4 w-4 ${getSpeedColor(speed)}`} />
        </motion.div>
        <span className={`text-sm font-medium ${getSpeedColor(speed)}`}>
          {getSpeedLabel(speed)}
        </span>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {speed}x
      </div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00f3ff, #ff00a0);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
          border: 2px solid #fff;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00f3ff, #ff00a0);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
};
