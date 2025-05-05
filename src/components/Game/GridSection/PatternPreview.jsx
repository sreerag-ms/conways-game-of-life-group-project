import React, { useEffect, useRef, useState } from 'react';

const PatternPreview = ({ cells, containerWidth = 64, containerHeight = 64, aliveColor = '#4682B4', deadColor = 'white' }) => {
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(0);

  if (!cells || !cells.length) return null;

  const height = cells.length;
  const width = cells[0].length;

  // Calculate the cell size based on container dimensions and pattern size
  useEffect(() => {
    if (containerRef.current) {
      // Calculate maximum possible cell size to fit the pattern in the container
      const maxCellWidth = Math.floor((containerWidth - 4) / width);  // 4px for padding
      const maxCellHeight = Math.floor((containerHeight - 4) / height);

      // Use the smaller dimension to ensure the pattern fits
      const optimalCellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));

      // Set minimum cell size of 2px
      setCellSize(Math.max(2, optimalCellSize - 1)); // -1 for gap
    }
    else {
      setCellSize(0);
    }
  }, [containerWidth, containerHeight, width, height]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center border border-gray-200 pattern-preview"
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
            gap: '1px',
            padding: '2px',
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
