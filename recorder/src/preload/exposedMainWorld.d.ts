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
        getAllLogRows(): Promise<ILogRow[]>;
        getAudioList(language: string): Promise<AudioList>;
        getMqttConnection(): Promise<boolean>;
        getSetting(key: string): string | null;
        initPlaylist(audioList: AudioList): void;
        reInitMqtt(): Promise<void>;
        removeAllLogging(): Promise<void>;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        startSession(): Promise<void>;
        stopSession(): Promise<void>;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
        VOPlaylistDo(action: "start" | "stop" | "next");
      };
      readonly events: {
        onMqttConnection(
          callback: (event: IpcMessageEvent, connection: boolean) => void
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
        onSessionStarted(
          callback: (event: IpcMessageEvent) => void
        ): () => void;
        onSessionStopped(
          callback: (event: IpcMessageEvent) => void
        ): () => void;
      };
    };
  }
}
