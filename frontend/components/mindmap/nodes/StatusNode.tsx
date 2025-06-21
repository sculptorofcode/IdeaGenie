
import React from 'react';
import { MindMapNode } from '../../../types/mindmap';
import ResponsiveNodeCard from '../ResponsiveNodeCard';

interface StatusNodeProps {
  node: Extract<MindMapNode, { type: 'status' }>;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const StatusNode: React.FC<StatusNodeProps> = ({
  node,
  isDragging,
  onMouseDown,
}) => {
  const isVisible = node.status !== 'hidden';
  const isActive = node.status === 'active';
  
  return (
    <div
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isDragging ? 1000 : 1,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.5s ease',
      }}
    >
      <div 
        className={`bg-yellow-50 border-yellow-200 shadow-lg transition-all duration-500 cursor-move 
          w-full max-w-xs sm:max-w-sm min-w-[250px] sm:min-w-[280px] 
          rounded-lg border-2 p-3 sm:p-4 ${isActive ? 'animate-pulse' : ''}`}
        onMouseDown={onMouseDown}
      >
        <div className="text-xs sm:text-sm font-medium text-yellow-800 flex items-center">
          {isActive && (
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
          )}
          {node.status === 'completed' && (
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          )}
          <span className="leading-relaxed">{node.title}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusNode;
