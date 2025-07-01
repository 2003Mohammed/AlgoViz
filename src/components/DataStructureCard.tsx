
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataStructure } from '../utils/dataStructureData';

interface DataStructureCardProps {
  dataStructure: DataStructure;
}

export const DataStructureCard: React.FC<DataStructureCardProps> = ({
  dataStructure
}) => {
  return (
    <motion.div
      className="glass-card p-6 h-full hover:border-primary/50 transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          {dataStructure.icon || <Database className="h-6 w-6 text-primary" />}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{dataStructure.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {dataStructure.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Link to={`/data-structures/${dataStructure.id}`}>
          <Button 
            variant="outline" 
            size="sm"
            className="group"
          >
            Visualize
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
