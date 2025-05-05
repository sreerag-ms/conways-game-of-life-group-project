import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_COLORS } from './constants';

/**
 * Custom hook to manage Game of Life theme colors
 * @returns {Object} Theme state and methods
 */
export const useGameOfLifeTheme = () => {
  // Initialize theme from localStorage or defaults
  const [theme, setTheme] = useState(() => ({ ...DEFAULT_COLORS }));

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameOfLifeTheme', JSON.stringify(theme));
  }, [theme]);

  // Update a specific color in the theme
  const updateColor = useCallback((colorKey, newColor) => {
    if (DEFAULT_COLORS.hasOwnProperty(colorKey)) {
      setTheme(prevTheme => ({
        ...prevTheme,
        [colorKey]: newColor,
      }));
    } else {
      console.warn(`Invalid color key: ${colorKey}`);
    }
  }, []);

  // Reset theme to default colors
  const resetTheme = useCallback(() => {
    setTheme({ ...DEFAULT_COLORS });
  }, []);

  // Set an entire theme at once
  const setFullTheme = useCallback((newTheme) => {
    // Ensure all required colors are present
    const completeTheme = {
      ...DEFAULT_COLORS,
      ...newTheme,
    };
    setTheme(completeTheme);
  }, []);

  return {
    theme,
    updateColor,
    resetTheme,
    setFullTheme,
  };
};
