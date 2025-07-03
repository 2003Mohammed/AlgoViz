
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plus, Minus, Search, ArrowUpDown, Shuffle } from 'lucide-react';

interface ArrayControlsProps {
  onInsert: (value: number, index?: number) => void;
  onDelete: (index: number) => void;
  onSearch: (value: number) => void;
  onBubbleSort: () => void;
  onSelectionSort: () => void;
  onGenerateRandom: () => void;
  isAnimating: boolean;
}

export const ArrayControls: React.FC<ArrayControlsProps> = ({
  onInsert,
  onDelete,
  onSearch,
  onBubbleSort,
  onSelectionSort,
  onGenerateRandom,
  isAnimating
}) => {
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const index = insertIndex ? parseInt(insertIndex) : undefined;
    
    if (isNaN(value)) {
      alert('Please enter a valid number to insert');
      return;
    }
    
    if (insertIndex && isNaN(index!)) {
      alert('Please enter a valid index');
      return;
    }
    
    onInsert(value, index);
    setInsertValue('');
    setInsertIndex('');
  };

  const handleDelete = () => {
    const index = parseInt(deleteIndex);
    
    if (isNaN(index)) {
      alert('Please enter a valid index to delete');
      return;
    }
    
    onDelete(index);
    setDeleteIndex('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid number to search');
      return;
    }
    
    onSearch(value);
    setSearchValue('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Insert Operation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Insert Element
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              type="number"
            />
            <Input
              placeholder="Index (optional)"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              type="number"
            />
          </div>
          <Button onClick={handleInsert} disabled={isAnimating} className="w-full">
            Insert
          </Button>
        </CardContent>
      </Card>

      {/* Delete Operation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minus className="h-4 w-4" />
            Delete Element
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Index to delete"
            value={deleteIndex}
            onChange={(e) => setDeleteIndex(e.target.value)}
            type="number"
          />
          <Button onClick={handleDelete} disabled={isAnimating} className="w-full">
            Delete
          </Button>
        </CardContent>
      </Card>

      {/* Search Operation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Element
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Value to search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="number"
          />
          <Button onClick={handleSearch} disabled={isAnimating} className="w-full">
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Sorting Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sorting Algorithms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onBubbleSort} disabled={isAnimating} className="w-full">
            Bubble Sort
          </Button>
          <Button onClick={onSelectionSort} disabled={isAnimating} className="w-full">
            Selection Sort
          </Button>
          <Button onClick={onGenerateRandom} disabled={isAnimating} variant="outline" className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Random Array
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
