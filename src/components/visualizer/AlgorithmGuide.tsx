
import React, { useState } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { 
  ChevronLeft, 
  ChevronRight,
  Code,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { GuideSlide } from '../../types/visualizer';
import { CodeHighlighter } from '../CodeHighlighter';
import { motion } from 'framer-motion';

interface AlgorithmGuideProps {
  algorithm: Algorithm;
  onSkip: (dontShowAgain: boolean) => void;
}

// Default slides if algorithm doesn't provide its own
const defaultSlides: GuideSlide[] = [
  {
    id: "1",
    title: "Introduction",
    content: "This algorithm visualizer will help you understand how the algorithm works step by step."
  },
  {
    id: "2",
    title: "How to Use",
    content: "Use the controls to play, pause, and step through the visualization. You can also adjust the speed."
  },
  {
    id: "3",
    title: "Ready?",
    content: "You're now ready to start visualizing! Click 'Start Visualizing' to begin."
  }
];

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithm, onSkip }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  const slides = (algorithm.slides as GuideSlide[]) || defaultSlides;
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
  
  const handleSkip = () => {
    onSkip(dontShowAgain);
  };
  
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {algorithm.name} Guide
        </h2>
        <Button variant="ghost" size="icon" onClick={handleSkip}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="bg-muted p-3 rounded-md mb-4">
              <h3 className="font-medium mb-2">Contents</h3>
              <ol className="space-y-1.5 text-sm">
                {slides.map((slide, index) => (
                  <li key={slide.id} className="flex items-center gap-2">
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-xs 
                      ${index === currentSlideIndex ? 'bg-primary text-primary-foreground' : 
                        index < currentSlideIndex ? 'bg-primary/20 text-muted-foreground' : 
                        'bg-muted-foreground/20 text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                    <span className={index === currentSlideIndex ? 'font-medium' : 'text-muted-foreground'}>
                      {slide.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="hidden md:block text-sm text-muted-foreground">
              <p>
                This guide provides a brief explanation of {algorithm.name} and how to use this visualizer.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{currentSlide.title}</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{currentSlide.content}</p>
            </div>
          </div>
          
          {currentSlide.code && (
            <div className="bg-muted rounded-md p-2 mb-4">
              <div className="flex items-center text-xs text-muted-foreground mb-2 px-2">
                <Code className="h-3.5 w-3.5 mr-1" />
                <span>Code Snippet</span>
              </div>
              <CodeHighlighter code={currentSlide.code} language="javascript" />
            </div>
          )}
          
          {currentSlide.image && (
            <div className="bg-muted rounded-md p-3 mb-4">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title} 
                className="rounded-md max-h-60 object-contain mx-auto"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="dontShowAgain" 
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(!!checked)} 
          />
          <label 
            htmlFor="dontShowAgain" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Don't show again
          </label>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            disabled={currentSlideIndex === 0}
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {currentSlideIndex < slides.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Start Visualizing
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
