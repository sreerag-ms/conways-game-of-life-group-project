import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from './constants';
import { hexToRgb } from './utils';

const WebGLGrid = ({
  activeCells,
  rows,
  cols,
  onCellClick,
  cellSize = 15,
  bornCells,
  dyingCells,
  showChanges,
  theme = { alive: '#ff8888', born: '#60a5fa', die: '#f87171', dead: '#ffffff' },
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const cellsTextureRef = useRef(null);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);

  // Set default grid visibility to true without UI control
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState({ r: 0, g: 0, b: 0, a: 0.5 });
  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

  // Calculate responsive cell size
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

  // Set up WebGL context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) {
      console.error('WebGL not supported');

      return;
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
        gridColor: gl.getUniformLocation(program, 'u_gridColor'),
        gridSize: gl.getUniformLocation(program, 'u_gridSize'),
        showGrid: gl.getUniformLocation(program, 'u_showGrid'),
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
    const width = cols * responsiveCellSize;
    const height = rows * responsiveCellSize;

    canvas.width = width;
    canvas.height = height;
    canvasWidth.current = width;
    canvasHeight.current = height;

    gl.viewport(0, 0, width, height);

    render();
  }, [rows, cols, responsiveCellSize, activeCells, bornCells, dyingCells, showGrid, gridColor, hoveredCell, showChanges, theme]);

  // Render cells
  const render = useCallback(() => {
    if (!rendererRef.current || !programRef.current || !cellsTextureRef.current) return;

    const gl = rendererRef.current;
    const program = programRef.current;
    const width = cols;
    const height = rows;

    const cellsData = new Uint8Array(width * height * 4);

    // Initialize all cells
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

    // Update texture
    gl.bindTexture(gl.TEXTURE_2D, cellsTextureRef.current);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      cellsData,
    );

    gl.useProgram(program.program);

    // Set uniforms
    gl.uniform2f(program.uniformLocations.resolution, canvasWidth.current, canvasHeight.current);
    gl.uniform1f(program.uniformLocations.cellSize, responsiveCellSize);
    gl.uniform2f(program.uniformLocations.gridSize, cols, rows);
    gl.uniform1i(program.uniformLocations.showGrid, showGrid ? 1 : 0);
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
    gl.uniform4f(program.uniformLocations.gridColor, gridColor.r, gridColor.g, gridColor.b, gridColor.a);
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
  }, [cols, rows, activeCells, bornCells, dyingCells, responsiveCellSize, showGrid, showChanges, gridColor, hoveredCell, theme]);

  // Mouse event handlers
  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / responsiveCellSize);
    const row = Math.floor(mouseY / responsiveCellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      setHoveredCell({ row, col });
    } else {
      setHoveredCell({ row: -1, col: -1 });
    }
  }, [responsiveCellSize, rows, cols]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell({ row: -1, col: -1 });
  }, []);

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / responsiveCellSize);
    const row = Math.floor(mouseY / responsiveCellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  }, [rows, cols, onCellClick, responsiveCellSize]);

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

  // Set up mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div className="flex flex-col items-center w-full" ref={containerRef}>
      <div className="flex items-center justify-center w-full overflow-auto border border-gray-300 rounded">
        <canvas
          ref={canvasRef}
          className="cursor-pointer"
          onClick={handleCanvasClick}
          style={{
            width: `${cols * responsiveCellSize}px`,
            height: `${rows * responsiveCellSize}px`,
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(WebGLGrid, (prevProps, nextProps) => (
  prevProps.rows === nextProps.rows &&
  prevProps.cols === nextProps.cols &&
  prevProps.activeCells === nextProps.activeCells &&
  prevProps.showChanges === nextProps.showChanges &&
  ((!prevProps.showChanges && !nextProps.showChanges) ||
   (prevProps.bornCells === nextProps.bornCells && prevProps.dyingCells === nextProps.dyingCells)) &&
  prevProps.theme?.alive === nextProps.theme?.alive &&
  prevProps.theme?.born === nextProps.theme?.born &&
  prevProps.theme?.die === nextProps.theme?.die
));
