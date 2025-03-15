
import { useState } from 'react';
import { generateRandomGraph, generateRandomTree } from '../../utils/visualizerUtils';
import { visualizeGraphOperation } from '../../utils/visualizations';
import { toast } from '../use-toast';
import { GraphData, TreeNode } from '../../types/visualizer';

export function useGraphTreeOperations(
  algorithmId: string,
  setGraphData: React.Dispatch<React.SetStateAction<GraphData | null>>,
  setTreeData: React.Dispatch<React.SetStateAction<TreeNode | null>>,
  resetAnimation: () => void,
  setSteps?: React.Dispatch<React.SetStateAction<any[]>>,
  setTotalSteps?: React.Dispatch<React.SetStateAction<number>>
) {
  const [startNode, setStartNode] = useState<string | undefined>();
  const [endNode, setEndNode] = useState<string | undefined>();
  
  const handleGenerateRandomGraph = () => {
    try {
      const newGraph = generateRandomGraph();
      setGraphData(newGraph);
      resetAnimation();
      
      // For algorithms that need a start and end node, set them automatically
      if (newGraph.nodes.length > 0) {
        const randomStartIndex = Math.floor(Math.random() * newGraph.nodes.length);
        let randomEndIndex;
        do {
          randomEndIndex = Math.floor(Math.random() * newGraph.nodes.length);
        } while (randomEndIndex === randomStartIndex && newGraph.nodes.length > 1);
        
        setStartNode(newGraph.nodes[randomStartIndex].id);
        setEndNode(newGraph.nodes[randomEndIndex].id);
        
        // If this is a pathfinding algorithm, generate visualization steps
        if (algorithmId === 'dijkstra' || algorithmId === 'bfs' || algorithmId === 'dfs') {
          const operation = algorithmId.replace('-', '');
          const steps = visualizeGraphOperation(
            newGraph, 
            operation, 
            newGraph.nodes[randomStartIndex].id,
            newGraph.nodes[randomEndIndex].id
          );
          
          if (setSteps) {
            setSteps(steps);
          }
          if (setTotalSteps) {
            setTotalSteps(steps.length);
          }
        }
      }
      
      toast({
        title: "Example graph generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating graph:", error);
      toast({
        title: "Error",
        description: "Failed to generate example graph",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateRandomTree = () => {
    try {
      const newTree = generateRandomTree();
      setTreeData(newTree);
      resetAnimation();
      
      toast({
        title: "Example tree generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating tree:", error);
      toast({
        title: "Error",
        description: "Failed to generate example tree",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    startNode,
    endNode,
    setStartNode,
    setEndNode
  };
}
