
import React from 'react';

interface AlgorithmGuideProps {
  algorithmId: string;
}

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ algorithmId }) => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Algorithm Guide</h3>
      <p className="text-sm text-muted-foreground">
        Guide for {algorithmId} coming soon.
      </p>
    </div>
  );
};
