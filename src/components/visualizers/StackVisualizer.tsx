
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';

const StackVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stack Visualizer (LIFO - Last In First Out)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Push Element</label>
              <div className="flex gap-2">
                <Input placeholder="Value" type="number" />
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pop Element</label>
              <Button size="sm" variant="destructive">
                <Minus className="h-4 w-4 mr-2" />
                Pop
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peek Top</label>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Peek
              </Button>
            </div>
          </div>

          {/* Stack Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-end justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Stack Visualization</p>
              <p className="text-sm">Coming Soon - Push and Pop operations</p>
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
              <h4 className="font-semibold mb-2">Stacks are used in:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Function call management (call stack)</li>
                <li>• Undo operations in applications</li>
                <li>• Browser history navigation</li>
                <li>• Expression evaluation and parsing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advantages:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Simple LIFO operations</li>
                <li>• Fast O(1) push and pop</li>
                <li>• Memory efficient</li>
                <li>• Easy to implement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StackVisualizer;
