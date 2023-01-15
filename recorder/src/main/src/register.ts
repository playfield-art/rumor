import { ipcMain } from "electron";
import { createNewRecordingFolder, getAudioList, startRecording, stopRecording } from "./controllers/audio";
import { getSetting, saveSetting, setNarrativesFolder, setRecordingsFolder } from "./controllers/setting";

export const registerActions = () => {
  ipcMain.on("saveSetting", saveSetting);
  ipcMain.on("startRecording", startRecording);
  ipcMain.on("stopRecording", stopRecording);
};

export const registerMethods = () => {
  ipcMain.handle("createNewRecordingFolder", createNewRecordingFolder);
  ipcMain.handle("getAudioList", getAudioList);
  ipcMain.handle("getSetting", getSetting);
  ipcMain.handle("setNarrativesFolder", setNarrativesFolder);
  ipcMain.handle("setRecordingsFolder", setRecordingsFolder);
}