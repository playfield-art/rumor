import { create } from "zustand";

interface RecorderState {
  isPlaying: boolean;
  startPlaying: () => void;
  stopPlaying: () => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  isPlaying: false,
  startPlaying: () => set(() => ({ isPlaying: true })),
  stopPlaying: () => set(() => ({ isPlaying: false })),
}));
