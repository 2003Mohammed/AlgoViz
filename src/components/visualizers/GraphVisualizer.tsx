
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Search, RotateCcw, GitBranch } from 'lucide-react';

const GraphVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Vertex</label>
              <div className="flex gap-2">
                <Input placeholder="Vertex" />
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Edge</label>
              <div className="flex gap-2">
                <Input placeholder="From-To" />
                <Button size="sm">
                  <GitBranch className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Remove Vertex</label>
              <div className="flex gap-2">
                <Input placeholder="Vertex" />
                <Button size="sm" variant="destructive">
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Path</label>
              <div className="flex gap-2">
                <Input placeholder="Start-End" />
                <Button size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Graph Visualization</p>
              <p className="text-sm">Coming Soon - Vertices, Edges, and Path Finding</p>
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
              <h4 className="font-semibold mb-2">Graphs are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Social networks (friends, connections)</li>
                <li>• GPS and navigation systems</li>
                <li>• Computer networks and internet</li>
                <li>• Recommendation systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advantages:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Models complex relationships</li>
                <li>• Flexible structure</li>
                <li>• Powerful algorithms (DFS, BFS)</li>
                <li>• Real-world problem solving</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphVisualizer;
