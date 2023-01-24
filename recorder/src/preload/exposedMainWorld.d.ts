import { IpcMessageEvent } from "electron";
import { AudioList, ISetting } from "@shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly actions: {
        saveSetting(setting: ISetting): void;
        startRecording(language: string, id: number): void;
        stopRecording(): void;
      };
      readonly methods: {
        createNewSession(language: string): Promise<AudioList>;
        getAudioList(language: string): Promise<AudioList>;
        getSetting(key: string): string | null;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
      };
      readonly events: {
        onNextVO(callback: (event: IpcMessageEvent) => void): () => void;
      };
    };
  }
}
