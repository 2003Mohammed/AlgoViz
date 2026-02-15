
import React from 'react';
import { 
  ArrayRenderer, 
  LinkedListRenderer, 
  StackRenderer, 
  QueueRenderer, 
  BinaryTreeRenderer, 
  HashTableRenderer, 
  GraphRenderer 
} from './structure-renderers';
import { VisualizationStep } from '../../types/visualizer';
import { motion } from 'framer-motion';

interface StructureRendererProps {
  structure: any;
  dataStructureId: string;
  animationStep?: VisualizationStep;
  currentStep?: number;
}

export const StructureRenderer: React.FC<StructureRendererProps> = ({ 
  structure, 
  dataStructureId,
  animationStep,
  currentStep = 0
}) => {
  const renderStructure = () => {
    switch (dataStructureId) {
      case 'array':
        return (
          <ArrayRenderer 
            array={animationStep ? animationStep.array : structure.map((item: any) => ({ value: item, status: 'default' }))} 
          />
        );
        
      case 'linked-list':
        return (
          <LinkedListRenderer 
            structure={animationStep?.structure ?? structure} 
          />
        );
        
      case 'stack':
        return (
          <StackRenderer 
            stack={animationStep ? animationStep.array : structure.map((item: any) => ({ value: item, status: 'default' }))} 
          />
        );
        
      case 'queue':
        return (
          <QueueRenderer 
            queue={animationStep ? animationStep.array : structure.map((item: any) => ({ value: item, status: 'default' }))} 
          />
        );
        
      case 'binary-tree':
        return (
          <BinaryTreeRenderer 
            tree={animationStep?.structure ?? structure} 
            animationStep={animationStep?.structure ?? animationStep}
          />
        );
        
      case 'hash-table':
        return (
          <HashTableRenderer 
            table={animationStep?.structure ?? structure} 
          />
        );
        
      case 'graph':
        return (
          <GraphRenderer 
            graph={animationStep?.structure ?? structure} 
          />
        );
        
      default:
        return (
          <div className="text-center text-muted-foreground">
            Visualization for this data structure is not available yet.
          </div>
        );
    }
  };

  return (
    <motion.div 
      className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden circuit-pattern shadow-[0_0_15px_rgba(0,100,255,0.3)]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderStructure()}
    </motion.div>
  );
};
