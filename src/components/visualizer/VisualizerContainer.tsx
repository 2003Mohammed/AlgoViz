import React, { useMemo, useRef, useState } from 'react';
import { Algorithm } from '../../utils/algorithms';
import { useVisualizerState } from '../../hooks/visualizer';
import { VisualizerHeader } from './VisualizerHeader';
import { ProgressTracker } from './ProgressTracker';
import { CustomArrayInput } from './CustomArrayInput';
import { ArrayVisualizer } from './array-visualizer';
import { VisualizerControls } from '../VisualizerControls';
import { VisualizerCodeSections } from './VisualizerCodeSections';
import { AlgorithmAnalysis } from './AlgorithmAnalysis';
import { RealWorldExamples } from './RealWorldExamples';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Info } from 'lucide-react';

interface VisualizerContainerProps {
  algorithm: Algorithm;
}

export const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ algorithm }) => {
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showPseudocode, setShowPseudocode] = useState(true);

  const {
    array,
    graphData,
    treeData,
    visualizationType,
    isPlaying,
    currentStep,
    totalSteps,
    activeLineIndex,
    speed,
    setSpeed,
    searchTarget,
    setSearchTarget,
    graphStartNode,
    setGraphStartNode,
    handleGenerateRandomArray,
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    handleCustomArraySubmit,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    exportVisualization,
  } = useVisualizerState(algorithm.id);

  const arrayPresets = useMemo(
    () => ({
      small: [5, 1, 9, 3, 7],
      medium: [12, 3, 18, 5, 9, 14, 2, 20, 7, 11],
      large: [22, 3, 17, 8, 30, 14, 2, 11, 25, 7, 19, 5, 27, 16, 10],
    }),
    []
  );

  const handleGenerateNewData = () => {
    if (visualizationType === 'array') {
      handleGenerateRandomArray();
    } else if (visualizationType === 'graph') {
      handleGenerateRandomGraph();
    } else if (visualizationType === 'tree') {
      handleGenerateRandomTree();
    }
  };

  return (
    <div className="space-y-6 md:space-y-8" ref={visualizerRef}>
      <motion.div
        className="cyber-panel overflow-visible rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="p-4 md:p-6">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-16 h-16 border-t-2 border-l-2 border-cyber-primary opacity-70" />
            <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-2 border-r-2 border-cyber-primary opacity-70" />

            <div className="relative z-10 space-y-4">
              <VisualizerHeader
                algorithmName={algorithm.name}
                onGenerateNewArray={handleGenerateNewData}
                onExportVisualization={exportVisualization}
              />

              <ProgressTracker currentStep={currentStep} totalSteps={totalSteps} algorithmId={algorithm.id} />

              <div className="sticky top-2 z-40">
                <VisualizerControls
                  isPlaying={isPlaying}
                  onPlayPause={togglePlayPause}
                  onReset={reset}
                  onStepForward={stepForward}
                  onStepBackward={stepBackward}
                  onJumpToStart={jumpToStart}
                  onJumpToEnd={jumpToEnd}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  disableBackward={currentStep === 0}
                  disableForward={currentStep === totalSteps - 1}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-4 md:gap-6 items-start">
                <div className="space-y-4 min-w-0">
                  {visualizationType === 'array' && (
                    <>
                      <CustomArrayInput onSubmit={handleCustomArraySubmit} />

                  {algorithm.id === 'binary-search' && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Binary Search Target</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <input
                            className="w-full rounded-md border px-3 py-2 bg-background"
                            aria-label="Binary search target"
                            placeholder="Enter target value"
                            value={searchTarget}
                            onChange={(event) => setSearchTarget(event.target.value)}
                          />
                          <Button variant="outline" onClick={() => handleCustomArraySubmit(array.map((item) => Number(item.value)))}>
                            Search
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}


                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Example Presets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                            <Button variant="outline" size="sm" onClick={() => handleCustomArraySubmit(arrayPresets.small)}>Small</Button>
                            <Button variant="outline" size="sm" onClick={() => handleCustomArraySubmit(arrayPresets.medium)}>Medium</Button>
                            <Button variant="outline" size="sm" onClick={() => handleCustomArraySubmit(arrayPresets.large)}>Large</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {visualizationType === 'graph' && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Graph Start Node</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <input
                            className="w-full rounded-md border px-3 py-2 bg-background"
                            aria-label="Graph start node"
                            placeholder="Enter start node (case-insensitive)"
                            value={graphStartNode}
                            onChange={(event) => setGraphStartNode(event.target.value)}
                          />
                          <Button variant="outline" onClick={handleGenerateRandomGraph}>Apply</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}


                  <motion.div
                    className="rounded-sm overflow-x-auto cyber-grid relative z-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <ArrayVisualizer array={array} graphData={graphData} treeData={treeData} type={visualizationType} algorithmId={algorithm.id} />
                  </motion.div>
                </div>

                <div className="space-y-4 min-w-0">
                  <Collapsible open={showPseudocode} onOpenChange={setShowPseudocode}>
                    <Card className="max-h-[520px] overflow-auto">
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="justify-between px-0 hover:bg-transparent">
                            <span className="font-semibold">Synchronized Pseudocode</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showPseudocode ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <VisualizerCodeSections algorithm={algorithm} activeLineIndex={activeLineIndex} pseudocodeOnly />
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  <Collapsible open={showInfoPanel} onOpenChange={setShowInfoPanel}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="justify-between px-0 hover:bg-transparent">
                            <span className="inline-flex items-center gap-2 font-semibold"><Info className="h-4 w-4" /> Algorithm Info</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showInfoPanel ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-3 text-sm">
                          <p><strong>Definition:</strong> {algorithm.description}</p>
                          <p><strong>Time:</strong> Best {algorithm.timeComplexity.best}, Average {algorithm.timeComplexity.average}, Worst {algorithm.timeComplexity.worst}</p>
                          <p><strong>Space:</strong> {algorithm.spaceComplexity}</p>
                          <p><strong>Use cases:</strong> {(algorithm.realWorldExamples?.slice(0, 2).map((item) => item.title).join(', ')) || 'General data processing and optimization tasks.'}</p>
                          <p><strong>Tip:</strong> Step through slowly first, then increase speed once you understand each transition.</p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-center text-cyber-primary/80" aria-live="polite">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="cyber-panel">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Help & Usage</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Use Play/Pause to animate, or use step controls for precise walkthroughs.</li>
            <li>Adjust animation speed to match your learning pace.</li>
            <li>Use presets or custom arrays to compare behavior across input sizes.</li>
          </ul>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="cyber-panel">
        <VisualizerCodeSections algorithm={algorithm} activeLineIndex={activeLineIndex} hidePseudocode />
      </motion.div>


      {algorithm.category === 'graph' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="cyber-panel">
          <div className="glass-card p-6 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-3">Graph Algorithm Summary</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Algorithm</th>
                  <th className="text-left py-2">Graph Type</th>
                  <th className="text-left py-2">Shortest Path</th>
                  <th className="text-left py-2">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2">BFS</td><td>Unweighted</td><td>Fewest edges</td><td>Simple shortest path</td></tr>
                <tr className="border-b"><td className="py-2">DFS</td><td>Unweighted</td><td>No</td><td>Traversal / cycles</td></tr>
                <tr className="border-b"><td className="py-2">Dijkstra</td><td>Weighted (non-negative)</td><td>Lowest cost</td><td>Weighted shortest path</td></tr>
                <tr><td className="py-2">A*</td><td>Weighted (non-negative)</td><td>Lowest cost</td><td>Faster pathfinding</td></tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="cyber-panel">
        <RealWorldExamples algorithm={algorithm} />
      </motion.div>


      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.5 }} className="cyber-panel">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-3">Learn More</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href={`https://www.w3schools.com/search/search.php?query=${algorithm.name}`} target="_blank" rel="noopener noreferrer" className="underline">W3Schools</a>
            <a href={`https://www.geeksforgeeks.org/search/?q=${algorithm.name}`} target="_blank" rel="noopener noreferrer" className="underline">GeeksforGeeks</a>
            <a href={`https://www.javatpoint.com/search?query=${algorithm.name}`} target="_blank" rel="noopener noreferrer" className="underline">Javatpoint</a>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="cyber-panel">
        <AlgorithmAnalysis algorithm={algorithm} />
      </motion.div>
    </div>
  );
};
