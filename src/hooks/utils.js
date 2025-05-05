export const areGridsEqual = (gridA, gridB) => {
  if (!gridA || !gridB) return false;
  if (gridA.length !== gridB.length) return false;

  for (let i = 0; i < gridA.length; i++) {
    if (gridA[i].length !== gridB[i].length) return false;
    for (let j = 0; j < gridA[i].length; j++) {
      if (gridA[i][j] !== gridB[i][j]) return false;
    }
  }

  return true;
};

const countAliveNeighbors = (grid, row, col, rows, cols) => {
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const neighborRow = row + x;
      const neighborCol = col + y;
      if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
        count += grid[neighborRow][neighborCol];
      }
    }
  }
  return count;
};

const determineNextCellState = (currentState, aliveNeighbors) => {
  if (currentState) {
    return aliveNeighbors === 2 || aliveNeighbors === 3;
  }
  return aliveNeighbors === 3;
};

/**
 * Calculate the next generation of cells based on Conway's Game of Life rules
 * @param {Array<Array<number>>} currentGrid - Current state of the grid
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array<Array<number>>} - Next generation grid
 */
export const calculateNextGenerationGrid = (currentGrid, rows, cols) => {
  const nextGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const aliveNeighbors = countAliveNeighbors(currentGrid, i, j, rows, cols);
      nextGrid[i][j] = determineNextCellState(currentGrid[i][j], aliveNeighbors) ? 1 : 0;
    }
  }

  return nextGrid;
};

const determineCellVisualizationState = (currentState, aliveNeighbors) => {
  if (currentState) {
    return (aliveNeighbors === 2 || aliveNeighbors === 3) ? 'survive' : 'die';
  }
  return aliveNeighbors === 3 ? 'born' : '';
};

/**
 * Calculate the state of cells for visualization
 * @param {Array<Array<number>>} currentGrid - Current state of the grid
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array<Array<string>>} - Grid with cell states ('die', 'survive', 'born', or '')
 */
export const calculateCellStates = (currentGrid, rows, cols) => {
  const stateGrid = Array.from({ length: rows }, () => Array(cols).fill(''));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const aliveNeighbors = countAliveNeighbors(currentGrid, i, j, rows, cols);
      stateGrid[i][j] = determineCellVisualizationState(currentGrid[i][j], aliveNeighbors);
    }
  }

  return stateGrid;
};

/**
 * Convert grid configuration to text format
 * @param {Array<Array<number>>} grid - Current grid
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {string} - Text representation of the grid
 */
export const gridToConfigText = (grid, rows, cols) => {
  if (!grid.length) return '';

  let configText = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      configText += grid[i][j];
    }
    if (i < rows - 1) configText += '\n';
  }

  return configText;
};

/**
 * Parse configuration text into a grid
 * @param {string} configText - Text representation of grid
 * @param {number} rows - Expected number of rows
 * @param {number} cols - Expected number of columns
 * @param {Array<Array<number>>} currentGrid - Current grid
 * @returns {Object} - Result with success flag, message, and grid data
 */
export const parseConfigText = (configText, rows, cols, currentGrid) => {
  if (!currentGrid.length) return { success: false, message: 'Generate the grid first!' };

  const lines = configText.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length !== rows) {
    return { success: false, message: 'Number of rows does not match grid.' };
  }

  const newGrid = [...currentGrid];

  for (let i = 0; i < rows; i++) {
    let cells = lines[i].split(/\s+/);
    if (cells.length === 1 && lines[i].length === cols) {
      cells = lines[i].split('');
    }
    if (cells.length !== cols) {
      return { success: false, message: `Row ${i + 1} length mismatch.` };
    }
    for (let j = 0; j < cols; j++) {
      newGrid[i][j] = cells[j] === '1' ? 1 : 0;
    }
  }

  return { success: true, grid: newGrid };
};
