
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface CustomArrayInputProps {
  onSubmit: (array: number[]) => void;
}

export const CustomArrayInput: React.FC<CustomArrayInputProps> = ({ onSubmit }) => {
  const [userInput, setUserInput] = useState<string>('');

  const handleUserArraySubmit = () => {
    try {
      // Parse user input as an array of numbers
      const inputArray = userInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`Invalid input: "${item}" is not a number`);
          }
          return num;
        });
      
      if (inputArray.length === 0) {
        throw new Error('Please enter at least one number');
      }
      
      if (inputArray.length > 30) {
        throw new Error('Maximum array size is 30 elements');
      }
      
      onSubmit(inputArray);
      setUserInput('');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Invalid input');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          aria-label="Custom array input"
          placeholder="Enter numbers separated by commas (e.g., 5, 3, 8, 1, 9)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleUserArraySubmit} className="whitespace-nowrap">
          Use Custom Array
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter your own dataset to visualize how the algorithm works on specific inputs.
      </p>
    </div>
  );
};
