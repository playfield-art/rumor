import { contextBridge, ipcRenderer } from "electron";
import {
  AudioList,
  ChapterOption,
  ILogType,
  ISetting,
} from "@shared/interfaces";
import { QLCFunction } from "@shared/enums";

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * Exposing the KweenB API in the main world
 */
contextBridge.exposeInMainWorld("rumor", {
  actions: {
    log: (message: string, type: ILogType) =>
      ipcRenderer.send("log", message, type),
    saveSetting: (setting: ISetting) =>
      ipcRenderer.send("saveSetting", setting),
    setCronSync: (cron: string) => ipcRenderer.send("setCronSync", cron),
    interface: {
      changeInterfacePage: (page: string) =>
        ipcRenderer.send("changeInterfacePage", page),
      pressButtonInterface: (button: number) =>
        ipcRenderer.send("pressButtonInterface", button),
    },
    light: {
      setColor: (color: "red" | "blue" | "green" | "white", value: number) =>
        ipcRenderer.send("setColor", color, value),
      triggerFunction: (qlcFunction: QLCFunction) =>
        ipcRenderer.send("triggerFunction", qlcFunction),
    },
  },
  methods: {
    getAllLogRows: () => ipcRenderer.invoke("getAllLogRows"),
    getAudioList: (language: string) =>
      ipcRenderer.invoke("getAudioList", language),
    getLocalNarrative: () => ipcRenderer.invoke("getLocalNarrative"),
    getMqttConnection: () => ipcRenderer.invoke("getMqttConnection"),
    getSetting: (key: string) => ipcRenderer.invoke("getSetting", key),
    getSelectedChapterOptionId: (chapter: string) =>
      ipcRenderer.invoke("getSelectedChapterOptionId", chapter),
    initPlaylist: (audioList: AudioList) =>
      ipcRenderer.invoke("initPlaylist", audioList),
    publishTopic: (topic: string, json?: Object) =>
      ipcRenderer.invoke("publishTopic", topic, json),
    reInitMqtt: () => ipcRenderer.invoke("reInitMqtt"),
    removeAllLogging: () => ipcRenderer.invoke("removeAllLogging"),
    setFileSetting: (key: string, filters?: Electron.FileFilter[]) =>
      ipcRenderer.invoke("setFileSetting", key, filters),
    setFolderSetting: (key: string) =>
      ipcRenderer.invoke("setFolderSetting", key),
    setRecordingsFolder: () => ipcRenderer.invoke("setRecordingsFolder"),
    setSelectedChapterOption: (chapterOption: ChapterOption) =>
      ipcRenderer.invoke("setSelectedChapterOptionId", chapterOption),
    startSession: () => ipcRenderer.invoke("startSession"),
    stopSession: () => ipcRenderer.invoke("stopSession"),
    syncNarrative: () => {
      ipcRenderer.invoke("syncNarrative");
    },
    uploadToCms: () => ipcRenderer.invoke("uploadToCms"),
    VOPlaylistDo: (action: "next") =>
      ipcRenderer.invoke("VOPlaylistDo", action),
  },
  events: {
    onDoorState: (callback: any) => {
      ipcRenderer.on("door-state", callback);
      return () => ipcRenderer.removeAllListeners("door-state");
    },
    onLanguageChanged: (callback: any) => {
      ipcRenderer.on("language-changed", callback);
      return () => ipcRenderer.removeAllListeners("language-changed");
    },
    onMqttConnection: (callback: any) => {
      ipcRenderer.on("mqtt-connection", callback);
      return () => ipcRenderer.removeAllListeners("mqtt-connection");
    },
    onNextVO: (callback: any) => {
      ipcRenderer.on("next-vo", callback);
      return () => ipcRenderer.removeAllListeners("next-vo");
    },
    onNotification: (callback: any) => {
      ipcRenderer.on("on-notification", callback);
      return () => ipcRenderer.removeAllListeners("on-notification");
    },
    onPlaySoundscape: (callback: any) => {
      ipcRenderer.on("play-soundscape", callback);
      return () => ipcRenderer.removeAllListeners("play-soundscape");
    },
    onProces: (callback: any) => {
      ipcRenderer.on("on-proces", callback);
      return () => ipcRenderer.removeAllListeners("on-proces");
    },
    onSessionStarted: (callback: any) => {
      ipcRenderer.on("session-started", callback);
      return () => ipcRenderer.removeAllListeners("session-started");
    },
    onSessionStopped: (callback: any) => {
      ipcRenderer.on("session-stopped", callback);
      return () => ipcRenderer.removeAllListeners("session-stopped");
    },
  },
});
