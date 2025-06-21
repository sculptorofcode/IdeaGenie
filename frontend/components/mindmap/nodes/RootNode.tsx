
import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import ResponsiveNodeCard from '../ResponsiveNodeCard';
import { MindMapNode } from '../../../types/mindmap';

interface RootNodeProps {
  node: Extract<MindMapNode, { type: 'root' }>;
  onNodeUpdate: (nodeId: string, updates: Partial<MindMapNode>) => void;
  onAddChild?: (parentNodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const RootNode: React.FC<RootNodeProps> = ({
  node,
  onNodeUpdate,
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
      <Input
        value={node.inputValue}
        onChange={(e) => onNodeUpdate(node.id, { inputValue: e.target.value })}
        placeholder="Enter your main topic..."
        className="mb-3 text-sm sm:text-base"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          size="sm" 
          onClick={() => console.log('Generate ideas clicked')}
          className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
        >
          Generate Ideas
        </Button>
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
    </ResponsiveNodeCard>
  );
};

export default RootNode;
