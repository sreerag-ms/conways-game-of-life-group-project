export const hexToRgb = (hex) => {
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return { r, g, b };
};
