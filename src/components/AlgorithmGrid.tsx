
import React, { useState } from 'react';
import { AlgorithmCard } from './AlgorithmCard';
import { algorithms, categories, Category } from '../utils/algorithmData';

export const AlgorithmGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const filteredAlgorithms = activeCategory === 'all' 
    ? algorithms 
    : algorithms.filter(algo => algo.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-md'
              : 'bg-secondary hover:bg-secondary/80 text-foreground/80'
          }`}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-secondary hover:bg-secondary/80 text-foreground/80'
            }`}
          >
            <category.icon className="h-4 w-4" />
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algorithm) => (
          <div key={algorithm.id} className="animate-fade-in">
            <AlgorithmCard algorithm={algorithm} />
          </div>
        ))}
      </div>
      
      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No algorithms found in this category.</p>
        </div>
      )}
    </div>
  );
};
