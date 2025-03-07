
import { 
  ArrowUpDown, 
  Search, 
  Network, 
  FolderTree, 
  Layers, 
  BarChart4 
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const categories: Category[] = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    description: 'Algorithms that arrange elements in a specific order',
    icon: ArrowUpDown
  },
  {
    id: 'searching',
    name: 'Searching Algorithms',
    description: 'Algorithms that find an element in a data structure',
    icon: Search
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    description: 'Algorithms that operate on graphs and networks',
    icon: Network
  },
  {
    id: 'tree',
    name: 'Tree Algorithms',
    description: 'Algorithms that operate on tree data structures',
    icon: FolderTree
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    description: 'Algorithms that break problems into simpler subproblems',
    icon: Layers
  },
  {
    id: 'other',
    name: 'Other Algorithms',
    description: 'Miscellaneous algorithms and data structures',
    icon: BarChart4
  }
];
