import { IpcMessageEvent } from "electron";
import {
  AudioList,
  ISetting,
  ProcesStatus,
  Notification,
  SoundScape,
  ILogRow,
} from "@shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly actions: {
        saveSetting(setting: ISetting): void;
        startRecording(language: string, id: number): void;
        stopRecording(): Promise<void>;
      };
      readonly methods: {
        createNewSession(): Promise<AudioList>;
        getAllLogRows(): Promise<ILogRow[]>;
        getAudioList(language: string): Promise<AudioList>;
        getSetting(key: string): string | null;
        initPlaylist(audioList: AudioList): void;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
        VOPlaylistDo(action: "start" | "stop" | "next");
      };
      readonly events: {
        onNextVO(callback: (event: IpcMessageEvent) => void): () => void;
        onNotification(
          callback: (event: IpcMessageEvent, notification: Notification) => void
        ): () => void;
        onPlaySoundscape(
          callback: (event: IpcMessageEvent, soundscape: SoundScape) => void
        ): () => void;
        onProces(
          callback: (event: IpcMessageEvent, procesStatus: ProcesStatus) => void
        ): () => void;
      };
    };
  }
}
