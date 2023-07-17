import { create } from "zustand";

interface LightState {
  red: number;
  green: number;
  blue: number;
  white: number;
  updateChannel: (channel: string, value: number) => void;
}

export const useLightStore = create<LightState>((set) => ({
  red: 0,
  green: 0,
  blue: 0,
  white: 0,
  updateChannel: (channel: string, value: number) =>
    set(() => ({ [channel]: value })),
}));
