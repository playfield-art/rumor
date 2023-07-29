import { IpcMessageEvent } from "electron";
import {
  AudioList,
  ISetting,
  ProcesStatus,
  Notification,
  SoundScape,
  ILogRow,
  ILogType,
  VoiceOver,
  QLCFunction,
  LocalNarrative,
  ChapterOption,
} from "@shared/interfaces";
import { IDoorState } from "../shared/interfaces";

declare global {
  interface Window {
    readonly rumor: {
      readonly actions: {
        log(message: string, log: ILogType): void;
        saveSetting(setting: ISetting): void;
        interface: {
          changeInterfacePage(page: string): void;
          pressButtonInterface(button: number): void;
        };
        light: {
          setColor(
            color: "red" | "blue" | "green" | "white",
            value: number
          ): void;
          triggerFunction(qlcFunction: QLCFunction): void;
        };
      };
      readonly methods: {
        getAllLogRows(): Promise<ILogRow[]>;
        getAudioList(language: string): Promise<AudioList>;
        getLocalNarrative(): Promise<LocalNarrative>;
        getMqttConnection(): Promise<boolean>;
        getSetting(key: string): Promise<string | null>;
        getSelectedChapterOptionId(chapter: string): Promise<string>;
        initPlaylist(audioList: AudioList): void;
        publishTopic(topic: string, json?: Object): Promise<void>;
        reInitMqtt(): Promise<void>;
        removeAllLogging(): Promise<void>;
        setFileSetting(
          key: string,
          filters?: Electron.FileFilter[]
        ): Promise<string>;
        setFolderSetting(key: string): Promise<string>;
        setRecordingsFolder(): string;
        setSelectedChapterOption(chapterOption: ChapterOption): Promise<void>;
        startSession(): Promise<void>;
        stopSession(): Promise<void>;
        syncNarrative(): Promise<void>;
        uploadToCms(): Promise<void>;
        VOPlaylistDo(action: "next"): Promise<void>;
      };
      readonly events: {
        onDoorState(
          callback: (event: IpcMessageEvent, doorState: IDoorState) => void
        ): () => void;
        onLanguageChanged(
          callback: (event: IpcMessageEvent, language: string) => void
        ): () => void;
        onMqttConnection(
          callback: (event: IpcMessageEvent, connection: boolean) => void
        ): () => void;
        onNextVO(
          callback: (event: IpcMessageEvent, voiceOver: VoiceOver) => void
        ): () => void;
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
          callback: (event: IpcMessageEvent, sessionFinished: boolean) => void
        ): () => void;
      };
    };
  }
}
