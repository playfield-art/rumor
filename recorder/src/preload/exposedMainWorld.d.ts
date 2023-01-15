import { IpcMessageEvent } from "electron";
import { AudioList } from "@shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly methods: {
        createNewRecordingFolder(): Promise<void>;
        getAudioList(): Promise<AudioList>;
        getSetting(key: string): string | null;
        setNarrativesFolder(): string;
        setRecordingsFolder(): string;
      };
      readonly actions: {
        saveSetting(setting: ISetting): void;
        startRecording(fileName: string): void;
        stopRecording(): void;
      };
      readonly events: {
        onNextVO(callback: (event: IpcMessageEvent) => void): () => void;
      };
    };
  }
}
