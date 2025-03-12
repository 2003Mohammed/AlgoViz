
import React from 'react';
import { Algorithm } from '../../utils/algorithms';
import { BriefcaseIcon, Globe, Info } from 'lucide-react';

interface RealWorldExamplesProps {
  algorithm: Algorithm;
}

export const RealWorldExamples: React.FC<RealWorldExamplesProps> = ({ algorithm }) => {
  if (!algorithm.realWorldExamples || algorithm.realWorldExamples.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        Real-World Applications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {algorithm.realWorldExamples.map((example, index) => (
          <div key={index} className="border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <BriefcaseIcon className="h-4 w-4" />
              </div>
              <h4 className="font-medium">{example.title}</h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {example.description}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Industry: {example.industry}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
