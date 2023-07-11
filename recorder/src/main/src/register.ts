import { ipcMain } from "electron";
import {
  stopSession,
  VOPlaylistDo,
  createNewSession,
  getAudioList,
  initPlaylist,
} from "./controllers/audio";
import { syncNarrative, uploadToCms } from "./controllers/sync";
import {
  getSetting,
  saveSetting,
  setFolderSetting,
  setRecordingsFolder,
} from "./controllers/setting";
import { getAllLogRows, log, removeAllLogging } from "./controllers/logging";

export const registerActions = () => {
  ipcMain.on("log", log);
  ipcMain.on("saveSetting", saveSetting);
};

export const registerMethods = () => {
  ipcMain.handle("createNewSession", createNewSession);
  ipcMain.handle("getAllLogRows", getAllLogRows);
  ipcMain.handle("getAudioList", getAudioList);
  ipcMain.handle("getSetting", getSetting);
  ipcMain.handle("initPlaylist", initPlaylist);
  ipcMain.handle("removeAllLogging", removeAllLogging);
  ipcMain.handle("setFolderSetting", setFolderSetting);
  ipcMain.handle("setRecordingsFolder", setRecordingsFolder);
  ipcMain.handle("stopSession", stopSession);
  ipcMain.handle("syncNarrative", syncNarrative);
  ipcMain.handle("uploadToCms", uploadToCms);
  ipcMain.handle("VOPlaylistDo", VOPlaylistDo);
};
