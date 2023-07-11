import { ipcMain } from "electron";
import {
  VOPlaylistDo,
  createNewSession,
  getAudioList,
  initPlaylist,
  startRecording,
  stopRecording,
} from "./controllers/audio";
import { syncNarrative, uploadToCms } from "./controllers/sync";
import {
  getSetting,
  saveSetting,
  setFolderSetting,
  setRecordingsFolder,
} from "./controllers/setting";
import { getAllLogRows } from "./controllers/logging";

export const registerActions = () => {
  ipcMain.on("saveSetting", saveSetting);
  ipcMain.on("startRecording", startRecording);
  ipcMain.on("stopRecording", stopRecording);
};

export const registerMethods = () => {
  ipcMain.handle("createNewSession", createNewSession);
  ipcMain.handle("getAllLogRows", getAllLogRows);
  ipcMain.handle("getAudioList", getAudioList);
  ipcMain.handle("getSetting", getSetting);
  ipcMain.handle("initPlaylist", initPlaylist);
  ipcMain.handle("setFolderSetting", setFolderSetting);
  ipcMain.handle("setRecordingsFolder", setRecordingsFolder);
  ipcMain.handle("syncNarrative", syncNarrative);
  ipcMain.handle("uploadToCms", uploadToCms);
  ipcMain.handle("VOPlaylistDo", VOPlaylistDo);
};
