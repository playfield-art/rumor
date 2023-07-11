import { IpcMessageEvent } from "electron";
import {
  AudioList,
  ISetting,
  ProcesStatus,
  Notification,
  SoundScape,
  ILogRow,
  ILogType,
} from "@shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly actions: {
        log(message: string, log: ILogType): void;
        saveSetting(setting: ISetting): void;
      };
      readonly methods: {
        createNewSession(): Promise<AudioList>;
        getAllLogRows(): Promise<ILogRow[]>;
        getAudioList(language: string): Promise<AudioList>;
        getSetting(key: string): string | null;
        initPlaylist(audioList: AudioList): void;
        removeAllLogging(): Promise<void>;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        stopSession(): Promise<void>;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
        VOPlaylistDo(action: "start" | "stop" | "next");
      };
      readonly events: {
        onCleanupSoundscape(
          callback: (event: IpcMessageEvent) => void
        ): () => void;
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
