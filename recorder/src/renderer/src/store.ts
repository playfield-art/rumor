import { ProcesStatus, SoundScape, VoiceOver } from "@shared/interfaces";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

class Store {
  currentSC: SoundScape | null;

  currentVO: VoiceOver | null;

  private defaultProcesStatus = {
    procesIsRunning: false,
    message: "Loading...",
  };

  procesStatus: ProcesStatus = this.defaultProcesStatus;

  constructor() {
    makeAutoObservable(this);
  }

  notify(message: string) {
    toast(message);
  }

  stopProces() {
    this.procesStatus = this.defaultProcesStatus;
  }

  runProces(message: string = "") {
    this.procesStatus = {
      procesIsRunning: true,
      message,
    };
  }
}

const store = new Store();

export default store;
