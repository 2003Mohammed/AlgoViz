
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const dataStructures = [
  { id: 'array', name: 'Array', description: 'Linear collection of elements with indexed access', path: '/data-structures/array' },
  { id: 'linked-list', name: 'Linked List', description: 'Dynamic linear structure with pointer-based connections', path: '/data-structures/linked-list' },
  { id: 'stack', name: 'Stack', description: 'LIFO (Last In First Out) data structure', path: '/data-structures/stack' },
  { id: 'queue', name: 'Queue', description: 'FIFO (First In First Out) data structure', path: '/data-structures/queue' },
  { id: 'tree', name: 'Binary Tree', description: 'Hierarchical structure with parent-child relationships', path: '/data-structures/tree' },
  { id: 'graph', name: 'Graph', description: 'Network of vertices connected by edges', path: '/data-structures/graph' }
];

const DataStructures: React.FC = () => {
  const navigate = useNavigate();

  const handleDataStructureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Data Structure Visualizers</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Choose a data structure to explore and interact with through visual animations
          </p>
        </motion.div>

        {/* Data Structure Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Available Data Structures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {dataStructures.map((structure) => (
                <motion.div
                  key={structure.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full cursor-pointer hover:border-primary/50 transition-all duration-300" onClick={() => handleDataStructureClick(structure.path)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{structure.name}</h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {structure.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataStructures;
