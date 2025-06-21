
import { useState, useCallback, useRef } from 'react';
import { ViewportState } from '../types/mindmap';

interface UseCanvasPanZoomProps {
  viewport: ViewportState;
  onViewportChange: (viewport: ViewportState) => void;
  minScale?: number;
  maxScale?: number;
}

export const useCanvasPanZoom = ({
  viewport,
  onViewportChange,
  minScale = 0.2,
  maxScale = 5,
}: UseCanvasPanZoomProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    start: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent, canvasElement: HTMLElement | null) => {
    if (e.target === canvasElement) {
      setIsDragging(true);
      dragState.current.start = { x: e.clientX, y: e.clientY };
      dragState.current.offset = { x: viewport.x, y: viewport.y };
      e.preventDefault();
    }
  }, [viewport]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragState.current.start.x;
      const deltaY = e.clientY - dragState.current.start.y;
      
      const newViewport = {
        ...viewport,
        x: dragState.current.offset.x + deltaX,
        y: dragState.current.offset.y + deltaY,
      };
      
      onViewportChange(newViewport);
    }
  }, [isDragging, viewport, onViewportChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent, canvasElement: HTMLElement | null) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(minScale, Math.min(maxScale, viewport.scale * delta));
    
    const rect = canvasElement?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = (mouseX - viewport.x) / viewport.scale;
      const worldY = (mouseY - viewport.y) / viewport.scale;
      
      const newViewport = {
        x: mouseX - worldX * newScale,
        y: mouseY - worldY * newScale,
        scale: newScale,
      };
      
      onViewportChange(newViewport);
    }
  }, [viewport, minScale, maxScale, onViewportChange]);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: TouchEvent, canvasElement: HTMLElement | null) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const mouseEvent = {
        target: e.target,
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      } as any;
      handleMouseDown(mouseEvent, canvasElement);
    }
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent;
      handleMouseMove(mouseEvent);
    }
  }, [isDragging, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.x) / viewport.scale,
      y: (screenY - viewport.y) / viewport.scale,
    };
  }, [viewport]);

  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    return {
      x: worldX * viewport.scale + viewport.x,
      y: worldY * viewport.scale + viewport.y,
    };
  }, [viewport]);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    screenToWorld,
    worldToScreen,
  };
};
