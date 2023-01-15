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
  methods: {
    createNewRecordingFolder: () => ipcRenderer.invoke("createNewRecordingFolder"),
    getAudioList: () => ipcRenderer.invoke("getAudioList"),
    getSetting: (key: string) => ipcRenderer.invoke("getSetting", key),
    setNarrativesFolder: () => ipcRenderer.invoke("setNarrativesFolder"),
    setRecordingsFolder: () => ipcRenderer.invoke("setRecordingsFolder"),
  },
  actions: {
    saveSetting: (setting: ISetting) => ipcRenderer.send("saveSetting", setting),
    startRecording: (fileName: string) => ipcRenderer.send("startRecording", fileName),
    stopRecording: () => ipcRenderer.send("stopRecording")
  },
  events: {
    onNextVO: (callback: any) => {
      ipcRenderer.on("next-vo", callback);
      return () => ipcRenderer.removeAllListeners("next-vo");
    }
  },
});
