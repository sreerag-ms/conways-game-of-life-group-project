import { PRIMARY_COLOR } from '../constants';

export const createPatternHtml = (cells, options = {}) => {
  if (!cells || !cells.length) return '';

  const {
    containerWidth = 80,
    containerHeight = 80,
    aliveColor = PRIMARY_COLOR,
    deadColor = 'white',
    borderColor = '#ccc',
  } = options;

  const height = cells.length;
  const width = cells[0].length;

  // Calculate the cell size based on container dimensions and pattern size
  const maxCellWidth = Math.floor((containerWidth - 4) / width);
  const maxCellHeight = Math.floor((containerHeight - 4) / height);
  const cellSize = Math.max(2, Math.min(maxCellWidth, maxCellHeight) - 1); // Minimum 2px, -1 for gap

  // Calculate actual dimensions based on computed cell size
  const actualWidth = width * (cellSize + 1) + 2;
  const actualHeight = height * (cellSize + 1) + 2;

  // Create container
  let html = `
    <div style="
      width: ${actualWidth}px;
      height: ${actualHeight}px;
      display: grid;
      grid-template-columns: repeat(${width}, ${cellSize}px);
      grid-template-rows: repeat(${height}, ${cellSize}px);
      gap: 1px;
      background-color: ${borderColor};
      padding: 1px;
    ">
  `;

  // Create cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isCellAlive = cells[y][x] === 1;
      const cellColor = isCellAlive ? aliveColor : deadColor;

      html += `
        <div style="
          width: ${cellSize}px;
          height: ${cellSize}px;
          background-color: ${cellColor};
        "></div>
      `;
    }
  }

  html += '</div>';

  return html;
};

/**
 * Create a data URL for a pattern preview image
 * Used for drag and drop operations where an actual element is needed
 *
 * @param {Array<Array<number>>} cells - Pattern cell structure
 * @returns {string} - Data URL for the pattern preview
 */
export const createPatternDragImage = (cells) => {
  const html = createPatternHtml(cells);

  // Convert HTML to data URL
  // First create a Blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });

  // Create a data URL from the blob
  return URL.createObjectURL(blob);
};

/**
 * Convert an image to a binary grid pattern
 *
 * @param {HTMLImageElement} imageData - Image element to process
 * @param {number} targetWidth - Width of the resulting pattern
 * @param {number} targetHeight - Height of the resulting pattern
 * @returns {Object} - Object containing cells, width, and height
 */
export const imageToPattern = (imageData, targetWidth, targetHeight) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match target dimensions
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw and scale the image
  ctx.drawImage(imageData, 0, 0, targetWidth, targetHeight);

  // Get pixel data
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const cells = Array(targetHeight).fill().map(() => Array(targetWidth).fill(0));

  // Convert to binary based on brightness
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      const r = imgData.data[idx];
      const g = imgData.data[idx + 1];
      const b = imgData.data[idx + 2];

      // Calculate brightness (0-255)
      const brightness = (r + g + b) / 3;

      // Convert to binary (1 for dark pixels, 0 for light)
      cells[y][x] = brightness < 128 ? 1 : 0;
    }
  }

  return {
    cells,
    width: targetWidth,
    height: targetHeight,
  };
};
