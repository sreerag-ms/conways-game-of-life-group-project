export const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform vec2 u_resolution;
  uniform float u_cellSize;
  varying vec2 v_texCoord;

  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }
`;

export const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform sampler2D u_cells;
  uniform vec4 u_aliveColor;
  uniform vec4 u_deadColor;
  uniform vec4 u_gridColor;
  uniform vec2 u_gridSize;
  uniform float u_cellSize;
  uniform bool u_showGrid;
  uniform vec2 u_hoveredCell;
  uniform bool u_showHoverEffect;
  uniform bool u_showChanges;
  uniform vec4 u_bornColor;
  uniform vec4 u_dieColor;

  varying vec2 v_texCoord;

  void main() {
    vec4 cellState = texture2D(u_cells, v_texCoord);

    if (v_texCoord.x < 0.0 || v_texCoord.x > 1.0 ||
        v_texCoord.y < 0.0 || v_texCoord.y > 1.0) {
      gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
      return;
    }

    vec2 cellCoord = floor(v_texCoord * u_gridSize);
    vec2 cellPos = fract(v_texCoord * u_gridSize);

    if (u_showHoverEffect &&
        cellCoord.x == u_hoveredCell.x && cellCoord.y == u_hoveredCell.y) {
      float borderThickness = 0.15;
      if (cellPos.x < borderThickness || cellPos.x > (1.0 - borderThickness) ||
          cellPos.y < borderThickness || cellPos.y > (1.0 - borderThickness)) {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
        return;
      }
    }

    float gridLine = step(0.97, cellPos.x) + step(0.97, cellPos.y);
    if (u_showGrid && gridLine > 0.0) {
      gl_FragColor = u_gridColor;
      return;
    }

    if (u_showChanges) {
      if (cellState.g > 0.5) {
        gl_FragColor = u_bornColor;
      } else if (cellState.b > 0.5) {
        gl_FragColor = u_dieColor;
      } else if (cellState.r > 0.5) {
        gl_FragColor = u_aliveColor;
      } else {
        gl_FragColor = u_deadColor;
      }
    } else {
      gl_FragColor = cellState.r > 0.5 ? u_aliveColor : u_deadColor;
    }
  }
`;
