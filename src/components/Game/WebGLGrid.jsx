import React, { useCallback, useEffect, useRef, useState } from 'react';

// WebGL shaders
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform vec2 u_resolution;
  uniform float u_cellSize;

  varying vec2 v_texCoord;

  void main() {
    // Convert position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // Convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    // Flip Y coordinate so positive Y is up
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    // Pass the texture coordinates to the fragment shader
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_cells;
  uniform vec4 u_aliveColor;
  uniform vec4 u_deadColor;
  uniform vec4 u_gridColor;
  uniform vec2 u_gridSize;
  uniform float u_cellSize;

  varying vec2 v_texCoord;

  void main() {
    // Calculate grid lines
    vec2 cellPos = fract(v_texCoord * u_gridSize);
    float gridLine = step(0.98, cellPos.x) + step(0.98, cellPos.y);

    // Get cell state from texture (0 = dead, 1 = alive)
    vec4 cellState = texture2D(u_cells, v_texCoord);

    // Mix cell color with grid line color
    gl_FragColor = gridLine > 0.0
      ? u_gridColor
      : (cellState.r > 0.5 ? u_aliveColor : u_deadColor);
  }
`;

const WebGLGrid = ({ activeCells, rows, cols, onCellClick, cellSize = 15 }) => {
  const canvasRef = useRef(null);
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const cellsTextureRef = useRef(null);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);

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

    // Initialize WebGL
    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) {
      console.error('WebGL not supported');

      return;
    }

    rendererRef.current = gl;

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    programRef.current = program;

    // Set up position attributes
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set up attribute for texture coordinates
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

    // Create texture for cell states
    const cellsTexture = gl.createTexture();
    cellsTextureRef.current = cellsTexture;

    // Store attributes and uniform locations
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
      },
      buffers: {
        position: positionBuffer,
        texCoord: texCoordBuffer,
      },
    };

    // Clean up when component unmounts
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

    // Update canvas size
    canvas.width = width;
    canvas.height = height;
    canvasWidth.current = width;
    canvasHeight.current = height;

    gl.viewport(0, 0, width, height);

    render();
  }, [rows, cols, responsiveCellSize, activeCells]);

  // Convert activeCells to texture data and render
  const render = useCallback(() => {
    if (!rendererRef.current || !programRef.current || !cellsTextureRef.current) return;

    const gl = rendererRef.current;
    const program = programRef.current;
    const width = cols;
    const height = rows;

    // Create cell state data (0 = dead, 1 = alive)
    const cellsData = new Uint8Array(width * height * 4); // RGBA for each cell

    // Initialize all cells as dead
    for (let i = 0; i < cellsData.length; i += 4) {
      cellsData[i] = 0;     // R
      cellsData[i + 1] = 0; // G
      cellsData[i + 2] = 0; // B
      cellsData[i + 3] = 255; // A (always fully opaque)
    }

    // Mark active cells
    activeCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      if (row >= 0 && row < height && col >= 0 && col < width) {
        const index = (row * width + col) * 4;
        cellsData[index] = 255; // Set R channel to 255 for active cells
      }
    });

    // Set up buffer with rectangle covering entire canvas
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

    // Update cell state texture
    gl.bindTexture(gl.TEXTURE_2D, cellsTextureRef.current);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // level
      gl.RGBA, // internal format
      width,
      height,
      0, // border
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      cellsData, // data
    );

    // Use the program
    gl.useProgram(program.program);

    // Set uniform values
    gl.uniform2f(program.uniformLocations.resolution, canvasWidth.current, canvasHeight.current);
    gl.uniform1f(program.uniformLocations.cellSize, responsiveCellSize);
    gl.uniform2f(program.uniformLocations.gridSize, cols, rows);

    // Set colors
    gl.uniform4f(program.uniformLocations.aliveColor, 0.6, 0.6, 0.6, 1.0); // Gray for alive
    gl.uniform4f(program.uniformLocations.deadColor, 1.0, 1.0, 1.0, 1.0); // White for dead
    gl.uniform4f(program.uniformLocations.gridColor, 0.8, 0.8, 0.8, 1.0); // Light gray for grid

    // Set texture
    gl.uniform1i(program.uniformLocations.cells, 0);

    // Set up position attribute
    gl.enableVertexAttribArray(program.attribLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.position);
    gl.vertexAttribPointer(program.attribLocations.position, 2, gl.FLOAT, false, 0, 0);

    // Set up texCoord attribute
    gl.enableVertexAttribArray(program.attribLocations.texCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.texCoord);
    gl.vertexAttribPointer(program.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

    // Draw
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [cols, rows, activeCells, responsiveCellSize]);

  // Handle cell clicks
  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate cell coordinates from click position
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    const col = Math.floor(canvasX / responsiveCellSize);
    const row = Math.floor(canvasY / responsiveCellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  }, [rows, cols, onCellClick, responsiveCellSize]);

  // Helper functions for WebGL
  function createShader(gl, type, source) {
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
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.error('Program failed to link:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);

      return null;
    }

    return program;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-auto">
      <canvas
        ref={canvasRef}
        className="border border-gray-200"
        onClick={handleCanvasClick}
        style={{
          width: `${cols * responsiveCellSize}px`,
          height: `${rows * responsiveCellSize}px`,
        }}
      />
    </div>
  );
};

export default React.memo(WebGLGrid, (prevProps, nextProps) =>
  (
    prevProps.rows === nextProps.rows &&
    prevProps.cols === nextProps.cols &&
    prevProps.activeCells === nextProps.activeCells
  ),
);
