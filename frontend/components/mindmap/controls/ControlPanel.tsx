
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface ControlPanelProps {
  onStartSimulation: () => void;
  isSimulating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartSimulation,
  isSimulating,
}) => {
  return (
    <Card className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 w-64 sm:w-72 md:w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base">IdeaGenie Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onStartSimulation}
          disabled={isSimulating}
          className="w-full text-xs sm:text-sm"
          size="sm"
        >
          {isSimulating ? 'Generating Ideas...' : 'Start Idea Generation'}
        </Button>
        <div className="text-xs text-gray-500 leading-relaxed">
          <div className="space-y-1">
            <div><strong>Pan:</strong> Click & drag canvas</div>
            <div><strong>Zoom:</strong> Mouse wheel</div>
            <div><strong>Move nodes:</strong> Drag node cards</div>
            <div><strong>Add children:</strong> Use Add Child button</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
