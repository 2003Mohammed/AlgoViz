
import React from 'react';
import { Link } from 'react-router-dom';
import { DataStructure } from '../utils/dataStructureData';
import { ArrowRight, Clock } from 'lucide-react';

interface DataStructureCardProps {
  dataStructure: DataStructure;
}

export const DataStructureCard: React.FC<DataStructureCardProps> = ({ dataStructure }) => {
  return (
    <div className="glass-card h-full group overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-5 flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-md text-primary">
            <dataStructure.icon className="h-6 w-6" />
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">
              {dataStructure.operations[0]?.timeComplexity || 'Varies'}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{dataStructure.name}</h3>
        <p className="text-sm text-muted-foreground flex-grow">
          {dataStructure.description}
        </p>
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <Link
            to={`/data-structures/${dataStructure.id}`}
            className="inline-flex items-center text-sm font-medium text-primary group-hover:underline"
          >
            Visualize
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
