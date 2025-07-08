
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';

const TreeVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Binary Tree Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Node</label>
              <div className="flex gap-2">
                <Input placeholder="Value" type="number" />
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Node</label>
              <div className="flex gap-2">
                <Input placeholder="Value" type="number" />
                <Button size="sm" variant="destructive">
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Node</label>
              <div className="flex gap-2">
                <Input placeholder="Value" type="number" />
                <Button size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Binary Tree Visualization</p>
              <p className="text-sm">Coming Soon - Insert, Delete, and Search operations</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Trees are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• File system hierarchies</li>
                <li>• Database indexing (B-trees)</li>
                <li>• Decision making algorithms</li>
                <li>• HTML DOM structure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advantages:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hierarchical data representation</li>
                <li>• Fast search O(log n) when balanced</li>
                <li>• Efficient insertion and deletion</li>
                <li>• Natural recursive structure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreeVisualizer;
