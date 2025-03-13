
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  SkipForward, 
  Check 
} from 'lucide-react';
import { Algorithm } from '../../utils/algorithms';
import { GuideSlide, AlgorithmGuideProps } from '../../types/visualizer';

// Function to generate guide slides based on algorithm
const getGuideSlides = (algorithm: Algorithm): GuideSlide[] => {
  // Base slides for any algorithm
  const baseSlides: GuideSlide[] = [
    {
      id: 1,
      title: "Welcome to the Algorithm Guide",
      content: `This guide will help you understand how the ${algorithm.name} algorithm works and how to use the visualizer effectively.`
    },
    {
      id: 2,
      title: "How the Visualizer Works",
      content: "The visualizer shows the algorithm's steps in real-time. You can use the controls to play, pause, step forward, and step backward through the visualization."
    }
  ];

  // Algorithm-specific slides
  if (algorithm.id === 'bubble-sort') {
    return [
      ...baseSlides,
      {
        id: 3,
        title: "Understanding Bubble Sort",
        content: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order."
      },
      {
        id: 4,
        title: "Visual Elements",
        content: "In the visualization, elements being compared are highlighted in yellow. When elements are swapped, they briefly turn blue. Sorted elements are shown in green."
      },
      {
        id: 5,
        title: "Time Complexity",
        content: `Bubble Sort has a time complexity of ${algorithm.timeComplexity.worst} in the worst case, making it efficient only for small lists or nearly sorted data.`
      },
      {
        id: 6,
        title: "You're Ready!",
        content: "Now you understand how Bubble Sort works. Use the controls below the visualization to explore the algorithm's behavior on different inputs."
      }
    ];
  }

  // For other algorithms, return the base slides plus a generic completion slide
  return [
    ...baseSlides,
    {
      id: 3,
      title: `Understanding ${algorithm.name}`,
      content: algorithm.description
    },
    {
      id: 4,
      title: "You're Ready!",
      content: "Now you understand the basics. Use the controls below the visualization to explore the algorithm's behavior on different inputs."
    }
  ];
};

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithm, onSkip }) => {
  const slides = getGuideSlides(algorithm);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onSkip(dontShowAgain); // Pass the checkbox state when completing
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{algorithm.name} Guide</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onSkip(dontShowAgain)}
          className="flex items-center gap-1"
        >
          <SkipForward className="h-4 w-4" />
          Skip Guide
        </Button>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{currentSlide.title}</h2>
          <p className="text-muted-foreground text-lg mb-6">{currentSlide.content}</p>
          
          {currentSlide.image && (
            <div className="my-6">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title} 
                className="rounded-lg mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlideIndex ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-1"
        >
          {isLastSlide ? (
            <>
              Start Visualizing
              <Check className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {isLastSlide && (
        <div className="mt-6 flex items-center space-x-2">
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
      )}
    </div>
  );
};
