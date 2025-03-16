
import React from 'react';
import { Layers, ChevronRight, Code } from 'lucide-react';
import { OperationsInfo } from '../OperationsInfo';
import { ImplementationCode } from '../ImplementationCode';
import { motion } from 'framer-motion';
import { DataStructure } from '../../../utils/dataStructureData';

interface ReferenceSectionProps {
  dataStructure: DataStructure;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ dataStructure }) => {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-xl font-semibold mb-4 flex items-center pixel-header">
            <Layers className="inline-block mr-2 h-5 w-5 text-primary" />
            Operations Reference
            <ChevronRight className="ml-2 h-4 w-4 text-primary" />
          </h3>
          <OperationsInfo operations={dataStructure.operations} />
        </div>
      </motion.div>
      
      {dataStructure.implementation && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="glass-card p-6 overflow-hidden">
            <h3 className="text-xl font-semibold mb-4 flex items-center pixel-header">
              <Code className="inline-block mr-2 h-5 w-5 text-primary" />
              Implementation Code
              <ChevronRight className="ml-2 h-4 w-4 text-primary" />
            </h3>
            <ImplementationCode code={dataStructure.implementation} />
          </div>
        </motion.div>
      )}
    </>
  );
};
