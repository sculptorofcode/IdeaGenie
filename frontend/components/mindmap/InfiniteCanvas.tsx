
import React, { useRef, useEffect } from 'react';
import { ViewportState } from '../../types/mindmap';
import { useCanvasPanZoom } from '../../hooks/useCanvasPanZoom';

interface InfiniteCanvasProps {
  children: React.ReactNode;
  viewport: ViewportState;
  onViewportChange: (viewport: ViewportState) => void;
  className?: string;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  children,
  viewport,
  onViewportChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  } = useCanvasPanZoom({
    viewport,
    onViewportChange,
    minScale: 0.2,
    maxScale: 5,
  });

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', (e) => handleWheel(e, canvas), { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (canvas) {
        canvas.removeEventListener('wheel', (e) => handleWheel(e, canvas));
      }
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  // Generate dotted background pattern - responsive to screen size
  const baseSpacing = 40;
  const dotRadius = 1.5;
  const adjustedSpacing = baseSpacing * viewport.scale;
  const offsetX = viewport.x % adjustedSpacing;
  const offsetY = viewport.y % adjustedSpacing;

  const dots = [];
  const canvasWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const canvasHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Generate fewer dots on mobile for performance
  const isMobile = canvasWidth < 768;
  const spacing = isMobile ? adjustedSpacing * 1.5 : adjustedSpacing;
  
  for (let x = offsetX - spacing; x < canvasWidth + spacing; x += spacing) {
    for (let y = offsetY - spacing; y < canvasHeight + spacing; y += spacing) {
      dots.push(
        <div
          key={`${Math.round(x)}-${Math.round(y)}`}
          className="absolute bg-gray-400 rounded-full pointer-events-none"
          style={{
            left: x,
            top: y,
            width: dotRadius * 2,
            height: dotRadius * 2,
            opacity: Math.min(0.6, viewport.scale * 0.8),
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    }
  }

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-screen overflow-hidden bg-white cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${className}`}
      onMouseDown={(e) => handleMouseDown(e, canvasRef.current)}
      // Add touch support for mobile
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        handleMouseDown(mouseEvent as any, canvasRef.current);
      }}
    >
      {/* Dotted background */}
      <div className="absolute inset-0 pointer-events-none">
        {dots}
      </div>
      
      {/* Content with transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default InfiniteCanvas;
