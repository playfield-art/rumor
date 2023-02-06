import { SoundScape, VoiceOver } from "@shared/interfaces";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

class Store {
  currentSC: SoundScape | null;

  currentVO: VoiceOver | null;

  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  notify(message: string) {
    toast(message);
  }
}

const store = new Store();

export default store;
