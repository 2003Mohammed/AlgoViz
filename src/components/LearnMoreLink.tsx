
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearnMoreLinkProps {
  algorithmName: string;
  isDataStructure?: boolean;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({ 
  algorithmName, 
  isDataStructure = false 
}) => {
  const getLearnMoreUrl = (name: string, isDS: boolean) => {
    const searchTerm = name.toLowerCase().replace(/\s+/g, '-');
    
    if (isDS) {
      // Data structure links
      switch (searchTerm) {
        case 'array':
          return 'https://www.w3schools.com/js/js_arrays.asp';
        case 'linked-list':
          return 'https://www.javatpoint.com/data-structure-linked-list';
        case 'stack':
          return 'https://www.javatpoint.com/data-structure-stack';
        case 'queue':
          return 'https://www.javatpoint.com/data-structure-queue';
        case 'binary-tree':
          return 'https://www.javatpoint.com/binary-tree';
        case 'hash-table':
          return 'https://www.javatpoint.com/hashing';
        case 'graph':
          return 'https://www.javatpoint.com/graph';
        default:
          return `https://www.javatpoint.com/data-structure-${searchTerm}`;
      }
    } else {
      // Algorithm links
      switch (searchTerm) {
        case 'bubble-sort':
          return 'https://www.w3schools.com/algorithms/bubble_sort.asp';
        case 'quick-sort':
          return 'https://www.w3schools.com/algorithms/quick_sort.asp';
        case 'merge-sort':
          return 'https://www.w3schools.com/algorithms/merge_sort.asp';
        case 'binary-search':
          return 'https://www.w3schools.com/algorithms/algorithm_binary_search.asp';
        case 'linear-search':
          return 'https://www.w3schools.com/algorithms/algorithm_search.asp';
        case 'depth-first-search':
        case 'dfs':
          return 'https://www.javatpoint.com/depth-first-search-algorithm';
        case 'breadth-first-search':
        case 'bfs':
          return 'https://www.javatpoint.com/breadth-first-search-algorithm';
        default:
          return `https://www.javatpoint.com/${searchTerm}-algorithm`;
      }
    }
  };

  const url = getLearnMoreUrl(algorithmName, isDataStructure);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 text-sm bg-background/50 hover:bg-primary/10 border-primary/20"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      <ExternalLink className="h-4 w-4" />
      Learn More
    </Button>
  );
};
