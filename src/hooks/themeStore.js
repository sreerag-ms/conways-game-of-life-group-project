import { create } from 'zustand';
import { DEFAULT_COLORS } from './constants';

const getDefaultColorsObject = () =>
  Object.fromEntries(DEFAULT_COLORS.map(({ key, defaultColor }) => [key, defaultColor]));

const getSavedTheme = () => {
  try {
    const saved = localStorage.getItem('gameOfLifeTheme');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }

  return { ...getDefaultColorsObject() };
};

export const useThemeStore = create((set) => ({
  theme: getSavedTheme(),

  updateColor: (colorKey, newColor) => {
    const defaultColorsObj = getDefaultColorsObject();
    if (defaultColorsObj.hasOwnProperty(colorKey)) {
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
    const defaultTheme = { ...getDefaultColorsObject() };
    localStorage.setItem('gameOfLifeTheme', JSON.stringify(defaultTheme));
    set({ theme: defaultTheme });
  },

  setFullTheme: (newTheme) => {
    // Ensure all required colors are present
    const completeTheme = {
      ...getDefaultColorsObject(),
      ...newTheme,
    };
    localStorage.setItem('gameOfLifeTheme', JSON.stringify(completeTheme));
    set({ theme: completeTheme });
  },
}));
