import React from 'react';
import { VisualizerControls } from '../../VisualizerControls';

interface AnimationControlsProps {
  isAnimating: boolean;
  currentStep: number;
  animationSteps: any[];
  speed: number;
  setCurrentStep: (step: number) => void;
  setIsAnimating: (animating: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  onReset: () => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isAnimating,
  currentStep,
  animationSteps,
  speed,
  setIsAnimating,
  onSpeedChange,
  onStepForward,
  onStepBackward,
  onJumpToStart,
  onJumpToEnd,
  onReset,
}) => {
  if (animationSteps.length === 0) return null;

  return (
    <div className="relative z-20">
      <VisualizerControls
        isPlaying={isAnimating}
        onPlayPause={() => setIsAnimating(!isAnimating)}
        onReset={onReset}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
        onJumpToStart={onJumpToStart}
        onJumpToEnd={onJumpToEnd}
        speed={speed}
        onSpeedChange={onSpeedChange}
        disableBackward={currentStep === 0}
        disableForward={currentStep === animationSteps.length - 1}
      />
    </div>
  );
};
