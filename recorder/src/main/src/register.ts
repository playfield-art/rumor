import { ipcMain } from "electron";
import {
  createNewSession,
  getAudioList,
  startRecording,
  stopRecording,
} from "./controllers/audio";
import { syncNarrative, uploadToCms } from "./controllers/sync";
import {
  getSetting,
  saveSetting,
  setNarrativesFolder,
  setRecordingsFolder,
} from "./controllers/setting";

export const registerActions = () => {
  ipcMain.on("saveSetting", saveSetting);
  ipcMain.on("startRecording", startRecording);
  ipcMain.on("stopRecording", stopRecording);
};

export const registerMethods = () => {
  ipcMain.handle("createNewSession", createNewSession);
  ipcMain.handle("getAudioList", getAudioList);
  ipcMain.handle("getSetting", getSetting);
  ipcMain.handle("setNarrativesFolder", setNarrativesFolder);
  ipcMain.handle("setRecordingsFolder", setRecordingsFolder);
  ipcMain.handle("syncNarrative", syncNarrative);
  ipcMain.handle("uploadToCms", uploadToCms);
};
