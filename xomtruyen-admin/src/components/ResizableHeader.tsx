import React, { useState, useRef } from 'react';

export const ResizableHeader: React.FC<{
  initialWidth?: number | string;
  minWidth?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}> = ({ initialWidth, minWidth = 40, onClick, style, className, children }) => {
  const [width, setWidth] = useState<number | string>(initialWidth || 'auto');
  const thRef = useRef<HTMLTableCellElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = thRef.current?.getBoundingClientRect().width || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.pageX - startX;
      setWidth(Math.max(minWidth, startWidth + diff));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th
      ref={thRef}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        minWidth: `${minWidth}px`,
        position: style?.position || 'relative',
        userSelect: 'none'
      }}
      onClick={onClick}
      className={className}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '6px',
          height: '100%',
          cursor: 'col-resize',
          zIndex: 1,
          borderRight: '2px solid transparent',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderRightColor = '#0d6efd')}
        onMouseLeave={(e) => (e.currentTarget.style.borderRightColor = 'transparent')}
      />
    </th>
  );
};
