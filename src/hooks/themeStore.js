import { create } from 'zustand';
import { DEFAULT_COLORS } from './constants';

// Initialize theme from localStorage if available
const getSavedTheme = () => {
  try {
    const saved = localStorage.getItem('gameOfLifeTheme');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }

  return { ...DEFAULT_COLORS };
};

export const useThemeStore = create((set) => ({
  // State
  theme: getSavedTheme(),

  // Methods
  updateColor: (colorKey, newColor) => {
    if (DEFAULT_COLORS.hasOwnProperty(colorKey)) {
      set((state) => {
        const newTheme = {
          ...state.theme,
          [colorKey]: newColor,
        };
        localStorage.setItem('gameOfLifeTheme', JSON.stringify(newTheme));

        return { theme: newTheme };
      });
    } else {
      console.warn(`Invalid color key: ${colorKey}`);
    }
  },

  resetTheme: () => {
    const defaultTheme = { ...DEFAULT_COLORS };
    localStorage.setItem('gameOfLifeTheme', JSON.stringify(defaultTheme));
    set({ theme: defaultTheme });
  },

  setFullTheme: (newTheme) => {
    // Ensure all required colors are present
    const completeTheme = {
      ...DEFAULT_COLORS,
      ...newTheme,
    };
    localStorage.setItem('gameOfLifeTheme', JSON.stringify(completeTheme));
    set({ theme: completeTheme });
  },
}));
