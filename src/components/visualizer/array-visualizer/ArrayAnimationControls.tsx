
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Play, Pause, RotateCcw, StepForward, StepBack } from 'lucide-react';
import { Progress } from '../../ui/progress';

interface ArrayAnimationControlsProps {
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const ArrayAnimationControls: React.FC<ArrayAnimationControlsProps> = ({
  isAnimating,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward
}) => {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={onStepBackward}
            disabled={currentStep === 0}
            variant="outline"
            size="sm"
          >
            <StepBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={isAnimating ? onPause : onPlay}
            disabled={totalSteps === 0}
            size="sm"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            variant="outline"
            size="sm"
          >
            <StepForward className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        {totalSteps > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-center text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
