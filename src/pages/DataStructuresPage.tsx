
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { dataStructures } from '../utils/dataStructureData';
import { DataStructureGrid } from '../components/DataStructureGrid';
import { DataStructureVisualizer } from '../components/data-structure-visualizer';
import { LearnMoreLink } from '../components/LearnMoreLink';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';

const DataStructuresPage = () => {
  const { dataStructureId } = useParams<{ dataStructureId?: string }>();
  const navigate = useNavigate();
  const [dataStructure, setDataStructure] = useState(dataStructures[0]);
  
  useEffect(() => {
    if (dataStructureId) {
      const found = dataStructures.find(ds => ds.id === dataStructureId);
      if (found) {
        setDataStructure(found);
      } else {
        navigate('/data-structures', { replace: true });
      }
    }
  }, [dataStructureId, navigate]);
  
  return (
    <Layout>
      <div className="container py-8">
        {dataStructureId ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => navigate('/data-structures')}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Data Structures
                </button>
                <div className="text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{dataStructure.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="heading-lg">{dataStructure.name}</h1>
                <div className="flex items-center gap-4">
                  <LearnMoreLink algorithmName={dataStructure.name} isDataStructure={true} />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    <Info className="h-4 w-4" />
                    <span>Category: {dataStructure.category.charAt(0).toUpperCase() + dataStructure.category.slice(1)}</span>
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-muted-foreground max-w-3xl">
                {dataStructure.description}
              </p>
            </div>
            
            <DataStructureVisualizer dataStructure={dataStructure} />
          </>
        ) : (
          <>
            <h1 className="heading-lg text-center mb-10">
              Explore Data Structures
            </h1>
            
            <div className="glass-card p-8">
              <DataStructureGrid />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DataStructuresPage;
