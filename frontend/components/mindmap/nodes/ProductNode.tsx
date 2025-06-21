
import React from 'react';
import { MindMapNode } from '../../../types/mindmap';
import { Button } from '../../ui/button';
import ResponsiveNodeCard from '../ResponsiveNodeCard';

interface ProductNodeProps {
  node: Extract<MindMapNode, { type: 'product' }>;
  onAddChild?: (parentNodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ProductNode: React.FC<ProductNodeProps> = ({
  node,
  onAddChild,
  onDeleteNode,
  isDragging,
  onMouseDown,
}) => {
  return (
    <ResponsiveNodeCard
      node={node}
      isDragging={isDragging}
      onMouseDown={onMouseDown}
    >
      <div className="space-y-3">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700">Description:</label>
          <p className="text-xs sm:text-sm mt-1 p-2 bg-white rounded border leading-relaxed">{node.description}</p>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700">Key Features:</label>
          <ul className="text-xs sm:text-sm mt-1 space-y-1">
            {node.features.map((feature, index) => (
              <li key={index} className="p-1 bg-white rounded border flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {onAddChild && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAddChild(node.id)}
              className="text-xs sm:text-sm w-full sm:w-auto"
            >
              Add Child
            </Button>
          )}
          {onDeleteNode && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDeleteNode(node.id)}
              className="text-xs sm:text-sm w-full sm:w-auto"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </ResponsiveNodeCard>
  );
};

export default ProductNode;
