
import React from 'react';
import { Badge } from '../../ui/badge';
import ResponsiveNodeCard from '../ResponsiveNodeCard';
import { MindMapNode } from '../../../types/mindmap';
import { Button } from '../../ui/button';

interface ProblemNodeProps {
  node: Extract<MindMapNode, { type: 'problem' }>;
  onAddChild?: (parentNodeId: string) => void;
  onGenerateProductIdea?: (problemNodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ProblemNode: React.FC<ProblemNodeProps> = ({
  node,
  onAddChild,
  onGenerateProductIdea,
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
          <label className="text-xs sm:text-sm font-medium text-gray-700">Context:</label>
          <p className="text-xs sm:text-sm mt-1 p-2 bg-white rounded border leading-relaxed">{node.context}</p>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700">URL:</label>
          <p className="text-xs sm:text-sm mt-1 p-2 bg-white rounded border text-blue-600 underline break-all">
            <a href={node.url} target="_blank" rel="noopener noreferrer">
              {node.url}
            </a>
          </p>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700">Pain Point:</label>
          <p className="text-xs sm:text-sm mt-1 p-2 bg-white rounded border leading-relaxed">{node.painPoint}</p>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700">Emotions:</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {node.emotions.map((emotion, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {emotion}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            size="sm" 
            onClick={() => onGenerateProductIdea?.(node.id)}
            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
          >
            Generate Product Idea
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
      </div>
    </ResponsiveNodeCard>
  );
};

export default ProblemNode;
