
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Visualizer } from '../components/Visualizer';
import { algorithms } from '../utils/algorithms';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';

const VisualizerPage = () => {
  const { algorithmId } = useParams<{ algorithmId?: string }>();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  
  useEffect(() => {
    if (algorithmId) {
      const found = algorithms.find(algo => algo.id === algorithmId);
      if (found) {
        setAlgorithm(found);
      } else {
        // If algorithm not found, navigate to the first algorithm
        navigate(`/visualizer/${algorithms[0].id}`, { replace: true });
      }
    } else {
      // If no algorithm specified, show all algorithms
      navigate('/visualizer', { replace: true });
    }
  }, [algorithmId, navigate]);
  
  return (
    <Layout>
      <div className="container py-8">
        {algorithmId ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => navigate('/visualizer')}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Algorithms
                </button>
                <div className="text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{algorithm.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="heading-lg">{algorithm.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  <Info className="h-4 w-4" />
                  <span>Category: {algorithm.category.charAt(0).toUpperCase() + algorithm.category.slice(1)}</span>
                </div>
              </div>
              
              <p className="mt-2 text-muted-foreground max-w-3xl">
                {algorithm.description}
              </p>
            </div>
            
            <Visualizer algorithm={algorithm} />
          </>
        ) : (
          <>
            <h1 className="heading-lg text-center mb-10">
              Choose an Algorithm to Visualize
            </h1>
            
            <div className="glass-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithms.map((algo) => (
                  <div
                    key={algo.id}
                    className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/visualizer/${algo.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-md text-primary">
                        <algo.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium">{algo.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {algo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default VisualizerPage;
