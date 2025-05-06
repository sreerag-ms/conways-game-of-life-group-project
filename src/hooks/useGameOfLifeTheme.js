import { useThemeStore } from './themeStore';

// TODO: Use the store directly, prevent the use if this hook
export const useGameOfLifeTheme = () => {
  const store = useThemeStore();

  return {
    theme: store.theme,
    updateColor: store.updateColor,
    resetTheme: store.resetResetTheme,
    setFullTheme: store.setFullTheme,
  };
};
