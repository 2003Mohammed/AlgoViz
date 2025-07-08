
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';

const SortingVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sorting Algorithms Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Bubble Sort</Button>
            <Button variant="outline" size="sm">Selection Sort</Button>
            <Button variant="outline" size="sm">Insertion Sort</Button>
            <Button variant="outline" size="sm">Merge Sort</Button>
            <Button variant="outline" size="sm">Quick Sort</Button>
            <Button variant="outline" size="sm">Heap Sort</Button>
          </div>

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-end justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Sorting Visualization</p>
              <p className="text-sm">Coming Soon - Multiple sorting algorithms</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Array
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Start Sort
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Best Case</th>
                  <th className="text-left p-2">Average Case</th>
                  <th className="text-left p-2">Worst Case</th>
                  <th className="text-left p-2">Space</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">Bubble Sort</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Selection Sort</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Quick Sort</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(log n)</td>
                </tr>
                <tr>
                  <td className="p-2">Merge Sort</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortingVisualizer;
