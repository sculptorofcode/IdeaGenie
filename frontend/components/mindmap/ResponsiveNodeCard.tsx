
import React from 'react';
import { MindMapNode } from '../../types/mindmap';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
interface ResponsiveNodeCardProps {
  node: MindMapNode;
  children: React.ReactNode;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ResponsiveNodeCard: React.FC<ResponsiveNodeCardProps> = ({
  node,
  children,
  isDragging,
  onMouseDown,
}) => {
  const getNodeColor = () => {
    switch (node.type) {
      case 'root':
        return 'bg-blue-50 border-blue-200';
      case 'problem':
        return 'bg-red-50 border-red-200';
      case 'product':
        return 'bg-green-50 border-green-200';
      case 'status':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <Card className={`${getNodeColor()} shadow-md hover:shadow-lg transition-shadow cursor-move 
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
        min-w-[280px] sm:min-w-[300px] md:min-w-[320px]`}>
        <CardHeader onMouseDown={onMouseDown} className="pb-3">
          <CardTitle className={`text-sm sm:text-base md:text-lg font-semibold ${
            node.type === 'root' ? 'text-blue-800' :
            node.type === 'problem' ? 'text-red-800' :
            node.type === 'product' ? 'text-green-800' :
            'text-yellow-800'
          }`}>
            {node.type === 'status' && (node as any).step && (
              <span className="text-xs sm:text-sm mr-2">Step {(node as any).step}:</span>
            )}
            {node.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveNodeCard;
