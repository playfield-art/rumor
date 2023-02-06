import { contextBridge, ipcRenderer } from "electron";
import { ISetting } from "@shared/interfaces";

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
    saveSetting: (setting: ISetting) =>
      ipcRenderer.send("saveSetting", setting),
    startRecording: (language: string, id: number) =>
      ipcRenderer.send("startRecording", language, id),
    stopRecording: () => ipcRenderer.send("stopRecording"),
  },
  methods: {
    createNewSession: () => ipcRenderer.invoke("createNewSession"),
    getAudioList: (language: string) =>
      ipcRenderer.invoke("getAudioList", language),
    getSetting: (key: string) => ipcRenderer.invoke("getSetting", key),
    setFolderSetting: (key: string) =>
      ipcRenderer.invoke("setFolderSetting", key),
    setRecordingsFolder: () => ipcRenderer.invoke("setRecordingsFolder"),
    syncNarrative: () => {
      ipcRenderer.invoke("syncNarrative");
    },
    uploadToCms: () => ipcRenderer.invoke("uploadToCms"),
  },
  events: {
    onNextVO: (callback: any) => {
      ipcRenderer.on("next-vo", callback);
      return () => ipcRenderer.removeAllListeners("next-vo");
    },
    onProces: (callback: any) => {
      ipcRenderer.on("on-proces", callback);
      return () => ipcRenderer.removeAllListeners("on-proces");
    },
    onNotification: (callback: any) => {
      ipcRenderer.on("on-notification", callback);
      return () => ipcRenderer.removeAllListeners("on-notification");
    },
  },
});
