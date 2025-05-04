import React, { useCallback, useEffect, useState } from 'react';

const Grid = ({ grid, onCellClick, cellSize = 15 }) => {
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

  useEffect(() => {
    const calculateCellSize = () => {
      const containerWidth = window.innerWidth > 768
        ? Math.min(window.innerWidth - 100, 800)
        : window.innerWidth - 40;

      const gridWidth = grid[0]?.length || 20;
      const optimalSize = Math.floor(containerWidth / gridWidth);

      return Math.max(4, Math.min(optimalSize, cellSize));
    };

    // Initial calculation
    setResponsiveCellSize(calculateCellSize());

    // Recalculate on resize
    const handleResize = () => {
      setResponsiveCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [grid, cellSize]);

  const renderCell = useCallback((value, rowIndex, colIndex) => {
    const isAlive = value === 1;

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
  }, [onCellClick, responsiveCellSize]);

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-auto">
      <div
        className="max-w-full border border-gray-200 grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${responsiveCellSize}px)`,
          gap: '0px',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex)),
        )}
      </div>
    </div>
  );
};

export default Grid;
