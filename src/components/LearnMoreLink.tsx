
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearnMoreLinkProps {
  algorithmName: string;
  isDataStructure?: boolean;
}

export const getLearnMoreUrl = (name: string, isDS: boolean) => {
  const searchTerm = name.toLowerCase().replace(/\s+/g, '-');
  
  if (isDS) {
    // Data structure links (prefer W3Schools DSA theory pages)
    switch (searchTerm) {
      case 'array':
        return 'https://www.w3schools.com/dsa/dsa_data_arrays.php';
      case 'linked-list':
        return 'https://www.w3schools.com/dsa/dsa_theory_linkedlist.php';
      case 'stack':
        return 'https://www.w3schools.com/dsa/dsa_theory_stack.php';
      case 'queue':
        return 'https://www.w3schools.com/dsa/dsa_theory_queue.php';
      case 'tree':
      case 'binary-tree':
        return 'https://www.w3schools.com/dsa/dsa_theory_tree.php';
      case 'graph':
        return 'https://www.w3schools.com/dsa/dsa_theory_graph.php';
      default:
        return `https://www.w3schools.com/dsa/index.php`;
    }
  } else {
    // Algorithm links
    switch (searchTerm) {
      case 'bubble-sort':
        return 'https://www.w3schools.com/dsa/dsa_algo_bubblesort.php';
      case 'selection-sort':
        return 'https://www.w3schools.com/dsa/dsa_algo_selectionsort.php';
      case 'insertion-sort':
        return 'https://www.w3schools.com/dsa/dsa_algo_insertionsort.php';
      case 'quick-sort':
        return 'https://www.w3schools.com/dsa/dsa_algo_quicksort.php';
      case 'heap-sort':
        return 'https://www.tutorialspoint.com/data_structures_algorithms/heap_sort_algorithm.htm';
      case 'merge-sort':
        return 'https://www.w3schools.com/dsa/dsa_algo_mergesort.php';
      case 'binary-search':
        return 'https://www.w3schools.com/dsa/dsa_algo_binarysearch.php';
      case 'linear-search':
        return 'https://www.w3schools.com/dsa/dsa_algo_linearsearch.php';
      case 'depth-first-search':
      case 'dfs':
        return 'https://www.w3schools.com/dsa/dsa_algo_graphs_dfs.php';
      case 'breadth-first-search':
      case 'bfs':
        return 'https://www.w3schools.com/dsa/dsa_algo_graphs_bfs.php';
      case 'dijkstra-algorithm':
        return 'https://www.w3schools.com/dsa/dsa_algo_graphs_dijkstra.php';
      default:
        return `https://www.w3schools.com/dsa/index.php`;
    }
  }
};

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({ 
  algorithmName, 
  isDataStructure = false 
}) => {
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
