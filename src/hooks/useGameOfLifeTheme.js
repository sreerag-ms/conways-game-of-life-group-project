import { useThemeStore } from './themeStore';

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
