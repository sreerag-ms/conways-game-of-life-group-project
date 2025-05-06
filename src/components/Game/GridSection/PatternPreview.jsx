import React, { useEffect, useRef, useState } from 'react';
import { PRIMARY_COLOR } from '../../../constants';

const PatternPreview = ({ cells, containerWidth = 64, containerHeight = 64, aliveColor = PRIMARY_COLOR, deadColor = 'white' }) => {
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(0.0);

  const height = cells.length;
  const width = cells[0].length;

  useEffect(() => {
    if (containerRef.current) {
      const maxCellWidth = Math.floor((containerWidth - 4) / width);
      const maxCellHeight = Math.floor((containerHeight - 4) / height);

      const optimalCellSize = (Math.min(maxCellWidth, maxCellHeight));

      setCellSize(optimalCellSize);
    }
    else {
      setCellSize(0);
    }
  }, [containerWidth, containerHeight, width, height]);

  if (!cells || !cells.length) return null;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden pattern-preview"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }}
    >
      {cellSize > 0 && (
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
            gap: '0px',
            padding: '0px',
            backgroundColor: '#f0f0f0',
          }}
        >
          {cells.flatMap((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: cell === 1 ? aliveColor : deadColor,
                }}
              />
            )),
          )}
        </div>
      )}
    </div>
  );
};

export default PatternPreview;
