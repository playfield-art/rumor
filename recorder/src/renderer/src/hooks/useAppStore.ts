import { ProcesStatus } from "@shared/interfaces";
import { create } from "zustand";

type AppState = {
  version: string;
  procesStatus: ProcesStatus;
};

type AppAction = {
  setVersion: (version: string) => void;
  startProces: (message: string) => void;
  stopProces: () => void;
};

export const useAppStore = create<AppState & AppAction>((set) => ({
  version: "",
  procesStatus: {
    procesIsRunning: false,
    message: "Loading...",
  },
  setVersion: (version: string) => set(() => ({ version })),
  startProces: (message: string) =>
    set(() => ({ procesStatus: { procesIsRunning: true, message } })),
  stopProces: () =>
    set(() => ({
      procesStatus: { procesIsRunning: false, message: "Loading..." },
    })),
}));
