import React, { useCallback, useEffect, useState } from 'react';

const Grid = ({ activeCells, rows, cols, onCellClick, cellSize = 15 }) => {
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

  useEffect(() => {
    const calculateCellSize = () => {
      const containerWidth = window.innerWidth > 768
        ? Math.min(window.innerWidth - 100, 800) : window.innerWidth - 40;

      const gridWidth = cols || 20;
      const optimalSize = Math.floor(containerWidth / gridWidth);

      return Math.max(4, Math.min(optimalSize, cellSize));
    };

    setResponsiveCellSize(calculateCellSize());

    const handleResize = () => {
      setResponsiveCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [cols, cellSize]);

  const isCellAlive = useCallback((rowIndex, colIndex) => activeCells.has(`${rowIndex},${colIndex}`), [activeCells]);

  const renderCell = useCallback((rowIndex, colIndex) => {
    const isAlive = isCellAlive(rowIndex, colIndex);

    return (
      <div
        key={`cell-${rowIndex}-${colIndex}`}
        className={`border border-gray-300 transition-colors duration-150 ${
          isAlive ? 'bg-gray-400' : 'bg-white'
        } hover:bg-gray-200 cursor-pointer`}
        style={{
          width: `${responsiveCellSize}px`,
          height: `${responsiveCellSize}px`,
        }}
        onClick={() => onCellClick(rowIndex, colIndex)}
      />
    );
  }, [onCellClick, responsiveCellSize, isCellAlive]);

  // Generate grid cells based on dimensions
  const renderGrid = useCallback(() => {
    const grid = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        grid.push(renderCell(rowIndex, colIndex));
      }
    }

    return grid;
  }, [rows, cols, renderCell]);

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-auto">
      <div
        className="max-w-full border border-gray-200 grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${responsiveCellSize}px)`,
          gap: '0px',
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default React.memo(Grid, (prevProps, nextProps) =>
  (
    prevProps.rows === nextProps.rows &&
    prevProps.cols === nextProps.cols &&
    prevProps.activeCells === nextProps.activeCells
  ),
);
