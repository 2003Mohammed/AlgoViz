
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ArrayVisualizer from '../components/visualizers/ArrayVisualizer';
import LinkedListVisualizer from '../components/visualizers/LinkedListVisualizer';
import StackVisualizer from '../components/visualizers/StackVisualizer';
import QueueVisualizer from '../components/visualizers/QueueVisualizer';
import TreeVisualizer from '../components/visualizers/TreeVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';

const dataStructures = [
  { id: 'array', name: 'Array', description: 'Linear collection of elements with indexed access' },
  { id: 'linked-list', name: 'Linked List', description: 'Dynamic linear structure with pointer-based connections' },
  { id: 'stack', name: 'Stack', description: 'LIFO (Last In First Out) data structure' },
  { id: 'queue', name: 'Queue', description: 'FIFO (First In First Out) data structure' },
  { id: 'tree', name: 'Binary Tree', description: 'Hierarchical structure with parent-child relationships' },
  { id: 'graph', name: 'Graph', description: 'Network of vertices connected by edges' }
];

const DataStructures: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState('array');

  const renderVisualizer = () => {
    switch (selectedStructure) {
      case 'array':
        return <ArrayVisualizer />;
      case 'linked-list':
        return <LinkedListVisualizer />;
      case 'stack':
        return <StackVisualizer />;
      case 'queue':
        return <QueueVisualizer />;
      case 'tree':
        return <TreeVisualizer />;
      case 'graph':
        return <GraphVisualizer />;
      default:
        return <ArrayVisualizer />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Data Structures</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore and interact with fundamental data structures through visual animations
          </p>
        </motion.div>

        {/* Structure Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Data Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dataStructures.map((structure) => (
                <Button
                  key={structure.id}
                  variant={selectedStructure === structure.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col gap-2"
                  onClick={() => setSelectedStructure(structure.id)}
                >
                  <span className="font-semibold">{structure.name}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {structure.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualizer */}
        <motion.div
          key={selectedStructure}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  );
};

export default DataStructures;
