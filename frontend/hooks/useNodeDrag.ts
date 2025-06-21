
import { useState, useCallback, useRef } from 'react';
import { Position } from '../types/mindmap';

interface UseNodeDragProps {
  initialPosition: Position;
  onPositionChange: (position: Position) => void;
  viewport: { scale: number };
}

export const useNodeDrag = ({
  initialPosition,
  onPositionChange,
  viewport,
}: UseNodeDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    start: { x: 0, y: 0 },
    nodeStart: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging if not clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    setIsDragging(true);
    dragState.current.start = { x: e.clientX, y: e.clientY };
    dragState.current.nodeStart = { ...initialPosition };
    
    // Calculate offset from mouse to node top-left corner
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragState.current.offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    e.stopPropagation();
    e.preventDefault();
  }, [initialPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      // Calculate delta in screen space, then convert to world space
      const deltaX = (e.clientX - dragState.current.start.x) / viewport.scale;
      const deltaY = (e.clientY - dragState.current.start.y) / viewport.scale;
      
      onPositionChange({
        x: dragState.current.nodeStart.x + deltaX,
        y: dragState.current.nodeStart.y + deltaY,
      });
    }
  }, [isDragging, viewport.scale, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
