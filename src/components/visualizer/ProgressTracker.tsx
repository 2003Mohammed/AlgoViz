
import React from 'react';
import { Progress } from '../ui/progress';
import { Check, BookOpen, Award } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  algorithmId: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  algorithmId
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((currentStep / (totalSteps - 1)) * 100), 100);
  
  // Determine if this algorithm has been completed before
  const isCompleted = localStorage.getItem(`algo-completed-${algorithmId}`) === 'true';
  
  // Update completion status if we're at 100%
  React.useEffect(() => {
    if (progressPercentage === 100 && !isCompleted) {
      localStorage.setItem(`algo-completed-${algorithmId}`, 'true');
    }
  }, [progressPercentage, algorithmId, isCompleted]);
  
  return (
    <div className="bg-secondary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Award className="h-5 w-5 text-green-500" />
          ) : (
            <BookOpen className="h-5 w-5 text-primary" />
          )}
          <h4 className="font-medium">Your Progress</h4>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium">{progressPercentage}%</span>
          {progressPercentage === 100 && <Check className="h-4 w-4 text-green-500" />}
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="mt-2 text-xs text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};
