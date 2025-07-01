
import React from 'react';
import { BookOpen, Clock, Zap } from 'lucide-react';
import { DataStructure } from '../../../utils/dataStructureData';
import { motion } from 'framer-motion';

interface ReferenceSectionProps {
  dataStructure: DataStructure;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ dataStructure }) => {
  return (
    <motion.div 
      className="cyber-panel p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Reference</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Complexity
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {dataStructure.operations.slice(0, 4).map((op, index) => (
              <div key={index} className="flex justify-between p-2 bg-muted/20 rounded">
                <span>{op.name}:</span>
                <span className="text-primary">{op.timeComplexity}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Key Features
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {dataStructure.description}</li>
            <li>• Category: {dataStructure.category}</li>
            <li>• Interactive visualization with real-time updates</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
