import React, { useCallback, useEffect, useState } from 'react';

const Grid = ({ 
  grid, 
  onCellClick, 
  cellSize = 15, 
  visualizationState = 'current',
  cellStates = [],
  colors = {},
}) => {
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

    setResponsiveCellSize(calculateCellSize());

    const handleResize = () => {
      setResponsiveCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [grid, cellSize]);

  const getCellColor = useCallback((isAlive, rowIndex, colIndex) => {
    if (visualizationState === 'preview' && cellStates[rowIndex]?.[colIndex]) {
      const state = cellStates[rowIndex][colIndex];
      switch (state) {
        case 'die':
          return colors.die ? { backgroundColor: colors.die } : 'bg-red-400';
        case 'born':
          return colors.born ? { backgroundColor: colors.born } : 'bg-blue-400';
        default:
          // For stable cells (empty state), show their current state without preview color
          return isAlive 
            ? colors.alive ? { backgroundColor: colors.alive } : 'bg-gray-400'
            : colors.dead ? { backgroundColor: colors.dead } : 'bg-white';
      }
    }
    
    return isAlive 
      ? colors.alive ? { backgroundColor: colors.alive } : 'bg-gray-400'
      : colors.dead ? { backgroundColor: colors.dead } : 'bg-white';
  }, [visualizationState, cellStates, colors]);

  const renderCell = useCallback((value, rowIndex, colIndex) => {
    const isAlive = value === 1;
    const cellStyle = getCellColor(isAlive, rowIndex, colIndex);
    const className = typeof cellStyle === 'string' ? cellStyle : '';

    return (
      <div
        key={`cell-${rowIndex}-${colIndex}`}
        className={`border border-gray-300 transition-colors duration-150 hover:bg-gray-200 cursor-pointer ${className}`}
        style={{
          width: `${responsiveCellSize}px`,
          height: `${responsiveCellSize}px`,
          ...(typeof cellStyle === 'object' ? cellStyle : {}),
        }}
        onClick={() => onCellClick(rowIndex, colIndex)}
      />
    );
  }, [onCellClick, responsiveCellSize, getCellColor]);

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
