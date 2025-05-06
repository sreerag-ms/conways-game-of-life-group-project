import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../../../hooks/canvasStore';
import { useGameOfLife } from '../../../hooks/useGameOfLife';
import { useGameOfLifeTheme } from '../../../hooks/useGameOfLifeTheme';
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from './constants';
import { hexToRgb } from './utils';

const WebGLGrid = ({ cellSize = 15, setStabilizedModalOpen }) => {

  const {
    activeCells,
    rows,
    cols,
    bornCells,
    dyingCells,
    showChanges,
    toggleCell,
    placePattern,
    createGrid,
    generation,
    stabilized,
  } = useGameOfLife();

  const { theme } = useGameOfLifeTheme();

  const {
    zoom,
    panOffset,
    activeTool,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    updatePanOffset,
  } = useCanvasStore();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const cellsTextureRef = useRef(null);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);

  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

  useEffect(() => {
    createGrid(50, 50);
  }, [createGrid]);

  useEffect(() => {
    const calculateCellSize = () => {
      // Use the same dimensions as the container in the render method
      const containerWidth = 800;
      const containerHeight = 500;

      const maxCellWidth = Math.floor(containerWidth / cols);
      const maxCellHeight = Math.floor(containerHeight / rows);

      let optimalSize = Math.min(maxCellWidth, maxCellHeight);

      if (rows <= 10 && cols <= 10) {
        optimalSize = Math.min(50, optimalSize);
      } else if (rows <= 20 && cols <= 20) {
        optimalSize = Math.min(35, optimalSize);
      } else if (rows <= 30 && cols <= 30) {
        optimalSize = Math.min(30, optimalSize);
      } else if (rows <= 50 && cols <= 50) {
        optimalSize = Math.min(25, optimalSize);
      } else if (rows <= 75 && cols <= 75) {
        optimalSize = Math.min(15, optimalSize);
      } else if (rows <= 100 && cols <= 100) {
        optimalSize = Math.min(12, optimalSize);
      } else if (rows <= 150 && cols <= 150) {
        optimalSize = Math.min(8, optimalSize);
      } else if (rows <= 500 && cols <= 500) {
        optimalSize = Math.min(4, optimalSize);
      } else if (rows <= 1000 && cols <= 1000) {
        optimalSize = Math.min(2, optimalSize);
      } else {
        optimalSize = 1;
      }

      return Math.max(1, optimalSize);
    };

    setResponsiveCellSize(calculateCellSize());

    const handleResize = () => {
      setResponsiveCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [rows, cols, cellSize]);

  // Set up WebGL context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try to get WebGL2 context first for better performance with large textures
    let gl = canvas.getContext('webgl2', { antialias: false });

    // Fall back to WebGL1 if WebGL2 is not available
    if (!gl) {
      gl = canvas.getContext('webgl', { antialias: false });
      if (!gl) {
        console.error('WebGL not supported');

        return;
      }
    }

    // Check maximum texture size
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    console.log(`Maximum texture size supported: ${maxTextureSize}x${maxTextureSize}`);

    // Check if the requested grid size exceeds maximum texture size
    if (rows > maxTextureSize || cols > maxTextureSize) {
      console.warn(`Grid size (${cols}x${rows}) exceeds maximum texture size (${maxTextureSize}x${maxTextureSize}). Some cells might not render correctly.`);
    }

    rendererRef.current = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    const program = createProgram(gl, vertexShader, fragmentShader);
    programRef.current = program;

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ]), gl.STATIC_DRAW);

    const cellsTexture = gl.createTexture();
    cellsTextureRef.current = cellsTexture;

    programRef.current = {
      program,
      attribLocations: {
        position: positionAttributeLocation,
        texCoord: texCoordLocation,
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        cellSize: gl.getUniformLocation(program, 'u_cellSize'),
        cells: gl.getUniformLocation(program, 'u_cells'),
        aliveColor: gl.getUniformLocation(program, 'u_aliveColor'),
        deadColor: gl.getUniformLocation(program, 'u_deadColor'),
        gridSize: gl.getUniformLocation(program, 'u_gridSize'),
        hoveredCell: gl.getUniformLocation(program, 'u_hoveredCell'),
        showHoverEffect: gl.getUniformLocation(program, 'u_showHoverEffect'),
        showChanges: gl.getUniformLocation(program, 'u_showChanges'),
        bornColor: gl.getUniformLocation(program, 'u_bornColor'),
        dieColor: gl.getUniformLocation(program, 'u_dieColor'),
      },
      buffers: {
        position: positionBuffer,
        texCoord: texCoordBuffer,
      },
    };

    // Cleanup
    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteTexture(cellsTexture);
    };
  }, []);

  // Handle canvas resizing and rendering
  useEffect(() => {
    if (!rendererRef.current || !programRef.current || !canvasRef.current) return;

    const gl = rendererRef.current;
    const canvas = canvasRef.current;

    let width = cols * responsiveCellSize;
    let height = rows * responsiveCellSize;

    const MAX_CANVAS_DIMENSION = 16384;
    if (width > MAX_CANVAS_DIMENSION || height > MAX_CANVAS_DIMENSION) {
      const aspectRatio = width / height;
      if (width > height) {
        width = MAX_CANVAS_DIMENSION;
        height = Math.floor(width / aspectRatio);
      } else {
        height = MAX_CANVAS_DIMENSION;
        width = Math.floor(height * aspectRatio);
      }
    }

    canvas.width = width;
    canvas.height = height;
    canvasWidth.current = width;
    canvasHeight.current = height;

    gl.viewport(0, 0, width, height);

    render();
  }, [rows, cols, responsiveCellSize, activeCells, bornCells, dyingCells, hoveredCell, showChanges, theme]);

  // Render cells
  const render = useCallback(() => {
    if (!rendererRef.current || !programRef.current || !cellsTextureRef.current) return;

    const gl = rendererRef.current;
    const program = programRef.current;

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const width = Math.min(cols, maxTextureSize);
    const height = Math.min(rows, maxTextureSize);

    let cellsData;

    try {
      cellsData = new Uint8Array(width * height * 4);
    } catch (e) {
      console.error('Failed to allocate memory for cells texture. Try reducing grid size.', e);

      return;
    }

    for (let i = 0; i < cellsData.length; i += 4) {
      cellsData[i] = 0;
      cellsData[i + 1] = 0;
      cellsData[i + 2] = 0;
      cellsData[i + 3] = 255;
    }

    // Mark active cells
    activeCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      if (row >= 0 && row < height && col >= 0 && col < width) {
        const index = (row * width + col) * 4;
        cellsData[index] = 255;
      }
    });

    // Mark born and dying cells if showing changes
    if (showChanges && bornCells && dyingCells) {
      bornCells.forEach(cellKey => {
        const [row, col] = cellKey.split(',').map(Number);
        if (row >= 0 && row < height && col >= 0 && col < width) {
          const index = (row * width + col) * 4;
          cellsData[index + 1] = 255;
        }
      });

      dyingCells.forEach(cellKey => {
        const [row, col] = cellKey.split(',').map(Number);
        if (row >= 0 && row < height && col >= 0 && col < width) {
          const index = (row * width + col) * 4;
          cellsData[index + 2] = 255;
        }
      });
    }

    // Set up buffer
    const left = 0;
    const right = canvasWidth.current;
    const top = 0;
    const bottom = canvasHeight.current;

    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      left, top,
      right, top,
      left, bottom,
      left, bottom,
      right, top,
      right, bottom,
    ]), gl.STATIC_DRAW);

    // For large textures, use appropriate levels of detail
    // and consider texture compression if available
    gl.bindTexture(gl.TEXTURE_2D, cellsTextureRef.current);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, cellsData);
    } catch (e) {
      console.error('WebGL error while updating texture. Grid might be too large.', e);
    }

    gl.useProgram(program.program);

    // Set uniforms
    gl.uniform2f(program.uniformLocations.resolution, canvasWidth.current, canvasHeight.current);
    gl.uniform1f(program.uniformLocations.cellSize, responsiveCellSize);
    gl.uniform2f(program.uniformLocations.gridSize, cols, rows);
    gl.uniform2f(program.uniformLocations.hoveredCell, hoveredCell.col, hoveredCell.row);
    gl.uniform1i(program.uniformLocations.showHoverEffect, hoveredCell.row >= 0 && hoveredCell.col >= 0 ? 1 : 0);
    gl.uniform1i(program.uniformLocations.showChanges, showChanges ? 1 : 0);

    // Set theme colors
    const aliveColor = hexToRgb(theme.alive || '#ff8888');
    const deadColor = hexToRgb(theme.dead || '#ffffff');
    const bornColor = hexToRgb(theme.born || '#60a5fa');
    const dieColor = hexToRgb(theme.die || '#f87171');

    gl.uniform4f(program.uniformLocations.aliveColor, aliveColor.r, aliveColor.g, aliveColor.b, 1.0);
    gl.uniform4f(program.uniformLocations.deadColor, deadColor.r, deadColor.g, deadColor.b, 1.0);
    gl.uniform4f(program.uniformLocations.bornColor, bornColor.r, bornColor.g, bornColor.b, 1.0);
    gl.uniform4f(program.uniformLocations.dieColor, dieColor.r, dieColor.g, dieColor.b, 1.0);
    gl.uniform1i(program.uniformLocations.cells, 0);

    // Set attributes
    gl.enableVertexAttribArray(program.attribLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.position);
    gl.vertexAttribPointer(program.attribLocations.position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(program.attribLocations.texCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.texCoord);
    gl.vertexAttribPointer(program.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

    // Draw
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [cols, rows, activeCells, bornCells, dyingCells, responsiveCellSize, showChanges, hoveredCell, theme]);

  // Convert screen coordinates to cell coordinates, accounting for zoom and pan
  const screenToGridCoordinates = useCallback((screenX, screenY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { row: -1, col: -1 };

    const rect = canvas.getBoundingClientRect();

    const x = (screenX - rect.left) / zoom;
    const y = (screenY - rect.top) / zoom;

    const col = Math.floor(x / responsiveCellSize);
    const row = Math.floor(y / responsiveCellSize);

    return { row, col };
  }, [zoom, panOffset, responsiveCellSize]);

  // Mouse event handlers
  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging && activeTool === 'hand') {
      // Handle panning
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      updatePanOffset(deltaX, deltaY);
      setDragStart(event.clientX, event.clientY);
    } else {
      // Handle cell hovering
      const { row, col } = screenToGridCoordinates(event.clientX, event.clientY);

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        setHoveredCell({ row, col });
      } else {
        setHoveredCell({ row: -1, col: -1 });
      }
    }
  }, [activeTool, dragStart, isDragging, rows, cols, updatePanOffset, setDragStart, screenToGridCoordinates]);

  const handleMouseDown = useCallback((event) => {
    if (activeTool === 'hand') {
      setIsDragging(true);
      setDragStart(event.clientX, event.clientY);
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [activeTool, setIsDragging, setDragStart]);

  const handleMouseUp = useCallback((event) => {
    if (isDragging) {
      setIsDragging(false);
      if (activeTool === 'hand') {
        canvasRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging, activeTool, setIsDragging]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell({ row: -1, col: -1 });
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging, setIsDragging]);

  const handleCanvasClick = useCallback((event) => {
    // Only handle cell clicking when using the mouse tool
    if (activeTool !== 'mouse' || isDragging) return;

    const { row, col } = screenToGridCoordinates(event.clientX, event.clientY);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      toggleCell(row, col);
    }
  }, [activeTool, isDragging, toggleCell, rows, cols, screenToGridCoordinates]);

  // Handle drag over event to indicate valid drop target
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drop event to place pattern
  const handleDrop = useCallback((event) => {
    event.preventDefault();

    try {
      // Get pattern data from the drag event
      const patternData = JSON.parse(event.dataTransfer.getData('application/json'));

      if (!patternData || !patternData.cells) {
        console.error('Invalid pattern data');

        return;
      }

      // Calculate drop position using our helper function
      const { row, col } = screenToGridCoordinates(event.clientX, event.clientY);

      // Place the pattern at the drop position
      placePattern(patternData, row, col);
    } catch (error) {
      console.error('Error handling pattern drop:', error);
    }
  }, [placePattern, screenToGridCoordinates]);

  // WebGL helpers
  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.error('Could not compile shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);

      return null;
    }

    return shader;
  };

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      gl.deleteProgram(program);

      return null;
    }

    return program;
  };

  // Set cursor style based on active tool
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = activeTool === 'hand'
        ? (isDragging ? 'grabbing' : 'grab')
        : 'pointer';
    }
  }, [activeTool, isDragging]);

  // Set up mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleDragOver, handleDrop]);

  // Calculate if grid should be centered (add this before the return statement)
  const gridWidth = cols * responsiveCellSize;
  const gridHeight = rows * responsiveCellSize;
  const containerWidth = 800;
  const containerHeight = 500;
  const centerX = gridWidth < containerWidth ? (containerWidth - gridWidth) / 2 : 0;
  const centerY = gridHeight < containerHeight ? (containerHeight - gridHeight) / 2 : 0;

  // Add additional warning if grid is extremely large
  useEffect(() => {
    if (rows > 3000 || cols > 3000) {
      console.warn(`Very large grid detected (${cols}x${rows}). Performance may be impacted.`);
    }
  }, [rows, cols]);

  return (
    <div className="flex flex-col items-center w-full rounded-lg" ref={containerRef}>
      <div className="relative flex items-center justify-center w-full overflow-hidden border-gray-300 rounded-lg"
        style={{
          width: '800px', // Fixed width
          height: '500px', // Fixed height
          maxWidth: '100%', // Responsive on small screens
        }}>
        <div
          className='bg-gray-100'
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              transformOrigin: '0 0',
              position: 'absolute',
              left: `${centerX}px`,
              top: `${centerY}px`,
            }}
          >
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className='border border-gray-300 rounded-lg'
              style={{
                width: `${cols * responsiveCellSize}px`,
                height: `${rows * responsiveCellSize}px`,
              }}
            />
          </div>
        </div>
        <div
          className="absolute px-3 py-1 font-semibold text-black rounded bg-slate-100 bg-opacity-30"
          style={{
            bottom: 5,
            right: 5,
            fontSize: '0.7rem',
            fontWeight: 'normal',
            zIndex: 10,
            backgroundColor: 'rgba(250, 250, 250, 0.6)',
          }}
        >
              Generation: {generation}
        </div>
      </div>
    </div>
  );
};

export default WebGLGrid;
