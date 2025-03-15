
import React, { useState } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { GuideSlide } from '../../types/visualizer';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface AlgorithmGuideProps {
  algorithm: Algorithm;
  onSkip: (dontShowAgain?: boolean) => void;
}

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithm, onSkip }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Define default slides if not provided in the algorithm
  const defaultSlides: GuideSlide[] = [
    {
      id: 1,
      title: `Introduction to ${algorithm.name}`,
      content: algorithm.description
    },
    {
      id: 2,
      title: 'How to Use This Visualizer',
      content: 'Use the controls at the bottom to start, pause, step through, or reset the visualization. You can also adjust the speed and input your own data to see how the algorithm performs.'
    },
    {
      id: 3,
      title: 'Ready to Start?',
      content: 'Click "Get Started" to begin visualizing the algorithm. You can always revisit this guide by clicking "Show Guide" in the top right corner.'
    }
  ];
  
  const slides = algorithm.slides || defaultSlides;
  const currentSlide = slides[currentSlideIndex];
  
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onSkip(dontShowAgain);
    }
  };
  
  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  return (
    <div className="glass-card p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Algorithm Guide</h3>
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
            Don't show again
          </label>
        </div>
      </div>
      
      <div className="relative">
        <div className="min-h-64 flex flex-col items-center justify-center px-8 py-12 bg-secondary/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{currentSlide.title}</h2>
          <p className="text-center max-w-2xl mb-6">{currentSlide.content}</p>
          
          {currentSlide.image && (
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-w-full max-h-60 object-contain rounded-md shadow-md mb-6"
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSlideIndex ? 'bg-primary' : 'bg-primary/30'
              }`}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onSkip(dontShowAgain)}>
            Skip
          </Button>
          <Button size="sm" onClick={handleNext}>
            {currentSlideIndex === slides.length - 1 ? (
              <>
                Get Started
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
