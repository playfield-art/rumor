import { SoundScape, VoiceOver } from "@shared/interfaces";
import { create } from "zustand";

type RecorderState = {
  isPlaying: boolean;
  currentVO: VoiceOver | null;
  currentSC: SoundScape | null;
};

type RecorderAction = {
  startPlaying: () => void;
  stopPlaying: () => void;
  clearCurrentVOandSC: () => void;
  updateCurrentVO: (voiceover: VoiceOver) => void;
  updateCurrentSC: (soundscape: SoundScape) => void;
};

export const useRecorderStore = create<RecorderState & RecorderAction>(
  (set) => ({
    isPlaying: false,
    currentVO: null,
    currentSC: null,
    clearCurrentVOandSC: () =>
      set(() => ({ currentVO: null, currentSC: null })),
    startPlaying: () => set(() => ({ isPlaying: true })),
    stopPlaying: () => set(() => ({ isPlaying: false })),
    updateCurrentVO: (voiceover: VoiceOver) =>
      set(() => ({ currentVO: voiceover })),
    updateCurrentSC: (soundscape: SoundScape) =>
      set(() => ({ currentSC: soundscape })),
  })
);
