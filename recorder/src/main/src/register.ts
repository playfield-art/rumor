import { ipcMain } from "electron";
import {
  stopSession,
  VOPlaylistDo,
  getAudioList,
  initPlaylist,
  startSession,
} from "./controllers/audio";
import { syncNarrative, uploadToCms } from "./controllers/sync";
import {
  getSetting,
  saveSetting,
  setFileSetting,
  setFolderSetting,
  setRecordingsFolder,
} from "./controllers/setting";
import { getAllLogRows, log, removeAllLogging } from "./controllers/logging";
import {
  getMqttConnection,
  publishTopic,
  reInitMqtt,
} from "./controllers/mqtt";
import { setColor, triggerFunction } from "./controllers/qlc";
import {
  changeInterfacePage,
  pressButtonInterface,
} from "./controllers/interface";

export const registerActions = () => {
  ipcMain.on("log", log);
  ipcMain.on("saveSetting", saveSetting);
  ipcMain.on("setColor", setColor);
  ipcMain.on("triggerFunction", triggerFunction);
  ipcMain.on("changeInterfacePage", changeInterfacePage);
  ipcMain.on("pressButtonInterface", pressButtonInterface);
};

export const registerMethods = () => {
  ipcMain.handle("getAllLogRows", getAllLogRows);
  ipcMain.handle("getAudioList", getAudioList);
  ipcMain.handle("getMqttConnection", getMqttConnection);
  ipcMain.handle("getSetting", getSetting);
  ipcMain.handle("initPlaylist", initPlaylist);
  ipcMain.handle("publishTopic", publishTopic);
  ipcMain.handle("reInitMqtt", reInitMqtt);
  ipcMain.handle("removeAllLogging", removeAllLogging);
  ipcMain.handle("setFileSetting", setFileSetting);
  ipcMain.handle("setFolderSetting", setFolderSetting);
  ipcMain.handle("setRecordingsFolder", setRecordingsFolder);
  ipcMain.handle("startSession", startSession);
  ipcMain.handle("stopSession", stopSession);
  ipcMain.handle("syncNarrative", syncNarrative);
  ipcMain.handle("uploadToCms", uploadToCms);
  ipcMain.handle("VOPlaylistDo", VOPlaylistDo);
};
