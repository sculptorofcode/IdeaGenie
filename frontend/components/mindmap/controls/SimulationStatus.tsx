
import React from 'react';
import { ApiSimulationStep } from '@/types/mindmap';

interface SimulationStatusProps {
  isSimulating: boolean;
  currentStep: number;
  simulationSteps: ApiSimulationStep[];
}

const SimulationStatus: React.FC<SimulationStatusProps> = ({
  isSimulating,
  currentStep,
  simulationSteps,
}) => {
  if (!isSimulating) return null;

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-10 
      bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-lg 
      w-64 sm:w-72 md:w-80">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-xs sm:text-sm font-medium">
          {simulationSteps[currentStep]?.message || 'Processing...'}
        </span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / simulationSteps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SimulationStatus;
