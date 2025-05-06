import { create } from 'zustand';

export const useCanvasStore = create((set) => ({
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  activeTool: 'mouse',
  isDragging: false,
  dragStart: { x: 0, y: 0 },

  setZoom: (newZoom) => set({ zoom: Math.max(0.25, Math.min(5, newZoom)) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(5, state.zoom * 1.2) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(0.25, state.zoom / 1.2) })),
  setPanOffset: (x, y) => set({ panOffset: { x, y } }),
  updatePanOffset: (deltaX, deltaY) => set((state) => ({
    panOffset: {
      x: state.panOffset.x + deltaX,
      y: state.panOffset.y + deltaY,
    },
  })),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDragStart: (x, y) => set({ dragStart: { x, y } }),
  resetView: () => set({ zoom: 1, panOffset: { x: 0, y: 0 } }),
}));
