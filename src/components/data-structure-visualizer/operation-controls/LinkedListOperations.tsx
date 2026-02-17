
import React, { useState } from 'react';
import { Plus, Minus, Search, RotateCcw, ChevronDown } from 'lucide-react';
import { OperationButton } from './OperationButton';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkedListOperationsProps {
  handleOperation: (operation: string) => void;
}

export const LinkedListOperations: React.FC<LinkedListOperationsProps> = ({ handleOperation }) => {
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular' | 'circular-doubly'>('singly');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const listTypes = [
    { value: 'singly', label: 'Singly Linked List' },
    { value: 'doubly', label: 'Doubly Linked List' },
    { value: 'circular', label: 'Circular Linked List' },
    { value: 'circular-doubly', label: 'Circular Doubly Linked List' }
  ];

  const handleTypeChange = (type: typeof listType) => {
    setListType(type);
    setShowTypeSelector(false);
    handleOperation(`change-type-${type}`);
  };

  return (
    <div className="space-y-4">
      {/* List Type Selector */}
      <div className="relative">
        <button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          className="w-full flex items-center justify-between px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <span className="text-sm font-medium">
            {listTypes.find(t => t.value === listType)?.label}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showTypeSelector ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showTypeSelector && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10"
            >
              {listTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value as typeof listType)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {type.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Operation Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton 
          operation="insert-beginning"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Insert at Head"
        />
        <OperationButton 
          operation="insert-end"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Insert at Tail"
        />
        <OperationButton 
          operation="insert-index"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Insert at Index"
        />
        <OperationButton 
          operation="delete-head"
          handleOperation={handleOperation}
          icon={<Minus className="h-4 w-4" />}
          label="Delete Head"
        />
        <OperationButton 
          operation="delete-tail"
          handleOperation={handleOperation}
          icon={<Minus className="h-4 w-4" />}
          label="Delete Tail"
        />
        <OperationButton 
          operation="delete-index"
          handleOperation={handleOperation}
          icon={<Minus className="h-4 w-4" />}
          label="Delete Index"
        />
        <OperationButton 
          operation="search"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Search"
        />
        <OperationButton 
          operation="reverse"
          handleOperation={handleOperation}
          icon={<RotateCcw className="h-4 w-4" />}
          label="Reverse"
        />
      </div>
    </div>
  );
};
