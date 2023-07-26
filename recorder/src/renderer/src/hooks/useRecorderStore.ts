import { SoundScape, VoiceOver } from "@shared/interfaces";
import { create } from "zustand";

type RecorderState = {
  isPlaying: boolean;
  currentVO: VoiceOver | null;
  currentSC: SoundScape | null;
  currentLanguage: string;
};

type RecorderAction = {
  startPlaying: () => void;
  stopPlaying: () => void;
  clearCurrentVOandSC: () => void;
  updateCurrentVO: (voiceover: VoiceOver) => void;
  updateCurrentSC: (soundscape: SoundScape) => void;
  updateCurrentLanguage: (language: string) => void;
};

export const useRecorderStore = create<RecorderState & RecorderAction>(
  (set) => ({
    isPlaying: false,
    currentVO: null,
    currentSC: null,
    currentLanguage: "",
    clearCurrentVOandSC: () =>
      set(() => ({ currentVO: null, currentSC: null })),
    startPlaying: () => set(() => ({ isPlaying: true })),
    stopPlaying: () => set(() => ({ isPlaying: false })),
    updateCurrentVO: (voiceover: VoiceOver) =>
      set(() => ({ currentVO: voiceover })),
    updateCurrentSC: (soundscape: SoundScape) =>
      set(() => ({ currentSC: soundscape })),
    updateCurrentLanguage: (language: string) =>
      set(() => ({ currentLanguage: language })),
  })
);
