
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { AlgorithmGuideProps, GuideSlide } from '../../types/visualizer';
import { motion } from 'framer-motion';

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithm, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Generate slides based on algorithm
  const slides: GuideSlide[] = [
    {
      id: 1,
      title: `Introduction to ${algorithm.name}`,
      content: algorithm.description,
      image: algorithm.visualizationImage || '/placeholder.svg'
    },
    {
      id: 2,
      title: 'How to use this visualizer',
      content: 'Use the controls below to step through the algorithm. You can play, pause, step forward/backward, and adjust the speed.',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Time & Space Complexity',
      content: `Time Complexity: ${algorithm.timeComplexity || 'Varies'}\nSpace Complexity: ${algorithm.spaceComplexity || 'Varies'}`,
      image: '/placeholder.svg'
    }
  ];
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onSkip(dontShowAgain);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  return (
    <motion.div 
      className="glass-card p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">{slides[currentSlide].title}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <p className="text-muted-foreground whitespace-pre-line">{slides[currentSlide].content}</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title} 
                className="max-h-64 object-contain rounded-md border border-border/50"
              />
            </div>
          </div>
        </motion.div>
        
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dontShowAgain" 
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label 
              htmlFor="dontShowAgain" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't show this guide again
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={prevSlide} 
              disabled={currentSlide === 0}
            >
              Previous
            </Button>
            <Button onClick={nextSlide}>
              {currentSlide < slides.length - 1 ? 'Next' : 'Start Visualizing'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
