import { useThemeStore } from './themeStore';

/**
 * Custom hook to manage Game of Life theme colors
 * @returns {Object} Theme state and methods
 */
export const useGameOfLifeTheme = () => {
  const store = useThemeStore();

  // Return the same API as before
  return {
    theme: store.theme,
    updateColor: store.updateColor,
    resetTheme: store.resetResetTheme,
    setFullTheme: store.setFullTheme,
  };
};
