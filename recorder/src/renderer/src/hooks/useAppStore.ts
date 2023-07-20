import { ProcesStatus } from "@shared/interfaces";
import { create } from "zustand";

type AppState = {
  procesStatus: ProcesStatus;
};

type AppAction = {
  startProces: (message: string) => void;
  stopProces: () => void;
};

export const useAppStore = create<AppState & AppAction>((set) => ({
  procesStatus: {
    procesIsRunning: false,
    message: "Loading...",
  },
  startProces: (message: string) =>
    set(() => ({ procesStatus: { procesIsRunning: true, message } })),
  stopProces: () =>
    set(() => ({
      procesStatus: { procesIsRunning: false, message: "Loading..." },
    })),
}));
