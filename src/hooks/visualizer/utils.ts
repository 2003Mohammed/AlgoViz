
import { toast } from '../use-toast';
import { ArrayItem, VisualizerStep } from '../../types/visualizer';
import { getVisualizationSteps } from '../../utils/algorithms/visualizations';

export const generateVisualizationSteps = (algorithmId: string, newArray: ArrayItem[]): VisualizerStep[] => {
  try {
    const visualizationSteps = getVisualizationSteps(algorithmId, newArray);
    return visualizationSteps;
  } catch (error) {
    console.error("Error generating visualization steps:", error);
    toast({
      title: "Error",
      description: "Failed to generate visualization steps",
      variant: "destructive",
    });
    return [];
  }
};

export const exportVisualizationData = (algorithmId: string, steps: VisualizerStep[], currentStep: number) => {
  try {
    const visualizationData = {
      algorithm: algorithmId,
      steps: steps,
      currentStep: currentStep
    };
    
    const blob = new Blob([JSON.stringify(visualizationData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithmId}-visualization.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Visualization exported",
      description: "You can save this file and import it later",
    });
  } catch (error) {
    console.error("Error exporting visualization:", error);
    toast({
      title: "Export failed",
      description: "Could not export the visualization",
      variant: "destructive",
    });
  }
};
