import { IpcMessageEvent } from "electron";
import {
  AudioList,
  ISetting,
  ProcesStatus,
  Notification,
} from "@shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly actions: {
        saveSetting(setting: ISetting): void;
        startRecording(language: string, id: number): void;
        stopRecording(): void;
      };
      readonly methods: {
        createNewSession(): Promise<AudioList>;
        getAudioList(language: string): Promise<AudioList>;
        getSetting(key: string): string | null;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
      };
      readonly events: {
        onNextVO(callback: (event: IpcMessageEvent) => void): () => void;
        onProces(
          callback: (event: IpcMessageEvent, procesStatus: ProcesStatus) => void
        ): () => void;
        onNotification(
          callback: (event: IpcMessageEvent, notification: Notification) => void
        ): () => void;
      };
    };
  }
}
