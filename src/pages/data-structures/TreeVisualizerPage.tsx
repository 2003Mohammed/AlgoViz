import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, StepForward, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import TreeVisualizer from '../../components/visualizers/TreeVisualizer';

const traversalOptions = [
  { label: 'Inorder', value: 'inorder' },
  { label: 'Preorder', value: 'preorder' },
  { label: 'Postorder', value: 'postorder' },
];

const TreeVisualizerPage: React.FC = () => {
  const [selectedTraversal, setSelectedTraversal] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [treeKey, setTreeKey] = useState(Date.now()); // for regenerating tree

  // Handler for play/pause/step
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => setStep((prev) => prev + 1);

  // Handler for traversal selection
  const handleTraversalSelect = (value: string) => {
    setSelectedTraversal(value);
    setIsPlaying(false);
    setStep(0);
  };

  // Handler for generating a new random tree
  const handleGenerateExample = () => {
    setTreeKey(Date.now());
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/data-structures" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Data Structures
          </Link>
          <span>/</span>
          <span className="text-foreground">Binary Tree</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Binary Tree Data Structure</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Explore hierarchical structures with parent-child relationships and tree traversals
          </p>
        </motion.div>

        {/* Traversal Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center mb-4"
        >
          {traversalOptions.map((option) => (
            <button
              key={option.value}
              className={`btn ${selectedTraversal === option.value ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleTraversalSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* Play/Pause/Step Controls */}
        {selectedTraversal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-center mb-4"
          >
            <button className="btn btn-success" onClick={handlePlay} disabled={isPlaying}>
              <Play className="h-5 w-5 mr-1" /> Play
            </button>
            <button className="btn btn-warning" onClick={handlePause} disabled={!isPlaying}>
              <Pause className="h-5 w-5 mr-1" /> Pause
            </button>
            <button className="btn btn-secondary" onClick={handleStep}>
              <StepForward className="h-5 w-5 mr-1" /> Step
            </button>
            <button className="btn btn-info" onClick={handleGenerateExample}>
              <RefreshCw className="h-5 w-5 mr-1" /> Generate Example
            </button>
          </motion.div>
        )}

        {/* Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TreeVisualizer
            key={treeKey}
            traversal={selectedTraversal}
            isPlaying={isPlaying}
            step={step}
            onTraversalEnd={() => setIsPlaying(false)}
            randomizeTree={treeKey} // pass key to trigger random tree
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TreeVisualizerPage;