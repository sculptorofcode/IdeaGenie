
import React, { useEffect } from 'react';
import { MindMapNode, Position } from '../../types/mindmap';
import RootNode from './nodes/RootNode';
import ProblemNode from './nodes/ProblemNode';
import ProductNode from './nodes/ProductNode';
import StatusNode from './nodes/StatusNode';
import { useNodeDrag } from '../../hooks/useNodeDrag';

interface NodeCardProps {
  node: MindMapNode;
  onPositionChange: (nodeId: string, position: Position) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<MindMapNode>) => void;
  onAddChild?: (parentNodeId: string) => void;
  onGenerateProductIdea?: (problemNodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  viewport: { scale: number };
}

const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onPositionChange,
  onNodeUpdate,
  onAddChild,
  onGenerateProductIdea,
  onDeleteNode,
  viewport,
}) => {
  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useNodeDrag({
    initialPosition: node.position,
    onPositionChange: (position) => onPositionChange(node.id, position),
    viewport,
  });

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const commonProps = {
    isDragging,
    onMouseDown: handleMouseDown,
  };

  switch (node.type) {
    case 'root':
      return (
        <RootNode
          node={node as Extract<MindMapNode, { type: 'root' }>}
          onNodeUpdate={onNodeUpdate}
          onAddChild={onAddChild}
          onDeleteNode={onDeleteNode}
          {...commonProps}
        />
      );
    case 'problem':
      return (
        <ProblemNode
          node={node as Extract<MindMapNode, { type: 'problem' }>}
          onAddChild={onAddChild}
          onGenerateProductIdea={onGenerateProductIdea}
          onDeleteNode={onDeleteNode}
          {...commonProps}
        />
      );
    case 'product':
      return (
        <ProductNode
          node={node as Extract<MindMapNode, { type: 'product' }>}
          onAddChild={onAddChild}
          onDeleteNode={onDeleteNode}
          {...commonProps}
        />
      );
    case 'status':
      return (
        <StatusNode
          node={node as Extract<MindMapNode, { type: 'status' }>}
          {...commonProps}
        />
      );
    default:
      return null;
  }
};

export default NodeCard;
