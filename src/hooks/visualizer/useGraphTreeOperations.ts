
import { generateRandomGraph, generateRandomTree } from '../../utils/visualizerUtils';
import { toast } from '../use-toast';

export function useGraphTreeOperations(
  algorithmId: string,
  setGraphData: React.Dispatch<React.SetStateAction<any>>,
  setTreeData: React.Dispatch<React.SetStateAction<any>>,
  resetAnimation: () => void
) {
  const handleGenerateRandomGraph = () => {
    try {
      const newGraph = generateRandomGraph();
      setGraphData(newGraph);
      resetAnimation();
      
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
    handleGenerateRandomTree
  };
}
