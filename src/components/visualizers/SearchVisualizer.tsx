
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, RotateCcw, Shuffle } from 'lucide-react';

const SearchVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Algorithms Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Linear Search</Button>
            <Button variant="outline" size="sm">Binary Search</Button>
            <Button variant="outline" size="sm">Jump Search</Button>
            <Button variant="outline" size="sm">Exponential Search</Button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Value</label>
            <div className="flex gap-2">
              <Input placeholder="Enter value to search" type="number" />
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Search Visualization</p>
              <p className="text-sm">Coming Soon - Multiple search algorithms</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Array
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
          <CardTitle>Search Algorithm Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Time Complexity</th>
                  <th className="text-left p-2">Space Complexity</th>
                  <th className="text-left p-2">Prerequisite</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">Linear Search</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">None</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Binary Search</td>
                  <td className="p-2">O(log n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">Sorted Array</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Jump Search</td>
                  <td className="p-2">O(√n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">Sorted Array</td>
                </tr>
                <tr>
                  <td className="p-2">Exponential Search</td>
                  <td className="p-2">O(log n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">Sorted Array</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchVisualizer;
