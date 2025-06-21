
import React from 'react';
import { MindMapNode } from '../../types/mindmap';

interface ConnectionLineProps {
  fromNode: MindMapNode;
  toNode: MindMapNode;
  color?: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  fromNode,
  toNode,
  color = '#94a3b8'
}) => {
  // Calculate connection points similar to prototype
  const fromCenterX = fromNode.position.x + 150; // Approximate center of card
  const fromCenterY = fromNode.position.y + 75;
  const toCenterX = toNode.position.x + 150;
  const toCenterY = toNode.position.y + 75;

  // Calculate deltas
  const deltaX = toCenterX - fromCenterX;
  const deltaY = toCenterY - fromCenterY;

  // Determine connection points based on direction (like prototype)
  let startX, startY, endX, endY, cp1X, cp1Y, cp2X, cp2Y;
  const offset = 100; // control point offset from prototype

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal connection
    if (deltaX > 0) {
      // Connect from right edge of parent to left edge of child
      startX = fromNode.position.x + 300; // right edge
      endX = toNode.position.x; // left edge
    } else {
      // Connect from left edge of parent to right edge of child
      startX = fromNode.position.x; // left edge
      endX = toNode.position.x + 300; // right edge
    }
    startY = fromCenterY;
    endY = toCenterY;
    cp1X = startX + (deltaX > 0 ? offset : -offset);
    cp1Y = startY;
    cp2X = endX - (deltaX > 0 ? offset : -offset);
    cp2Y = endY;
  } else {
    // Vertical connection
    if (deltaY > 0) {
      // Connect from bottom edge of parent to top edge of child
      startY = fromNode.position.y + 150; // bottom edge
      endY = toNode.position.y; // top edge
    } else {
      // Connect from top edge of parent to bottom edge of child
      startY = fromNode.position.y; // top edge
      endY = toNode.position.y + 150; // bottom edge
    }
    startX = fromCenterX;
    endX = toCenterX;
    cp1X = startX;
    cp1Y = startY + (deltaY > 0 ? offset : -offset);
    cp2X = endX;
    cp2Y = endY - (deltaY > 0 ? offset : -offset);
  }

  // Create Bezier path
  const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

  // Calculate bounds for SVG
  const minX = Math.min(startX, endX, cp1X, cp2X) - 20;
  const minY = Math.min(startY, endY, cp1Y, cp2Y) - 20;
  const maxX = Math.max(startX, endX, cp1X, cp2X) + 20;
  const maxY = Math.max(startY, endY, cp1Y, cp2Y) + 20;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        zIndex: 0,
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${fromNode.id}-${toNode.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={color}
          />
        </marker>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${fromNode.id}-${toNode.id})`}
        className="drop-shadow-sm"
        style={{
          transform: `translate(${-minX}px, ${-minY}px)`,
        }}
      />
    </svg>
  );
};

export default ConnectionLine;
