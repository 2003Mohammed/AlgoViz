
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';

const QueueVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Queue Visualizer (FIFO - First In First Out)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enqueue Element</label>
              <div className="flex gap-2">
                <Input placeholder="Value" type="number" />
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dequeue Element</label>
              <Button size="sm" variant="destructive">
                <Minus className="h-4 w-4 mr-2" />
                Dequeue
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peek Front</label>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Peek
              </Button>
            </div>
          </div>

          {/* Queue Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Queue Visualization</p>
              <p className="text-sm">Coming Soon - Enqueue and Dequeue operations</p>
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
              <h4 className="font-semibold mb-2">Queues are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Task scheduling in operating systems</li>
                <li>• Print queue management</li>
                <li>• Breadth-first search algorithms</li>
                <li>• Request handling in web servers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advantages:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fair FIFO ordering</li>
                <li>• Fast O(1) enqueue and dequeue</li>
                <li>• Predictable behavior</li>
                <li>• Great for buffering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueVisualizer;
