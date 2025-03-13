
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Algorithm } from '../../utils/algorithms';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { AlgorithmGuideProps, GuideSlide } from '../../types/visualizer';

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithm, onSkip }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  const slides: GuideSlide[] = [
    {
      id: 1,
      title: `What is ${algorithm.name}?`,
      content: algorithm.description,
    },
    {
      id: 2,
      title: 'How it works',
      content: algorithm.longDescription || 'This algorithm solves problems by using a specific approach tailored to its domain.',
    },
    {
      id: 3,
      title: 'Visualizer Controls',
      content: 'Use the play/pause button to start or stop the visualization. You can also step forward or backward, adjust the speed, or reset the visualization at any time.',
    },
  ];
  
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    onSkip(dontShowAgain);
  };
  
  const currentSlide = slides[currentSlideIndex];
  
  return (
    <div className="glass-card p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Algorithm Guide</h2>
        <Button variant="ghost" size="icon" onClick={() => onSkip(dontShowAgain)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-3">{currentSlide.title}</h3>
        <p className="text-muted-foreground">{currentSlide.content}</p>
        
        {currentSlide.image && (
          <div className="mt-4">
            <img src={currentSlide.image} alt={currentSlide.title} className="max-w-full rounded-md border" />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dontShowAgain" 
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked === true)}
          />
          <label
            htmlFor="dontShowAgain"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Don't show this guide again
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          
          {currentSlideIndex < slides.length - 1 ? (
            <Button onClick={handleNext} className="flex items-center">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>Get Started</Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex space-x-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlideIndex
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
