/**
 * The setting controller
 */

import { ISetting } from "@shared/interfaces";
import { dialog } from "electron";
import { AudioRecording } from "../lib/audio/AudioRecording";
import { AudioRecordingSingleton } from "../lib/audio/AudioRecordingSingleton";
import { Exception } from "../lib/exceptions/Exception";
import SettingHelper from "../lib/settings/SettingHelper";
import { Recorder } from "../recorder";

/**
 * Save a setting
 * @param event The event
 * @param setting The setting formed as ISetting
 */
export const saveSetting = async (
  event: Electron.IpcMainInvokeEvent,
  setting: ISetting
) => {
  try {
    SettingHelper.saveSetting(setting);
  } catch (e: any) {
    throw new Exception({ where: "createSetting", message: e.message });
  }
};

/**
 * Get a setting
 * @param event The event
 * @param setting The setting formed as ISetting
 */
export const getSetting = async (
  event: Electron.IpcMainInvokeEvent,
  key: string
): Promise<string | null> => {
  try {
    const setting = await SettingHelper.getSetting(key);
    return setting ? setting.value : "";
  } catch (e: any) {
    throw new Exception({ where: "getSetting", message: e.message });
  }
};

/**
 * Set a file setting
 * @param event
 * @param key
 * @returns
 */
export const setFileSetting = async (
  event: Electron.IpcMainInvokeEvent,
  key: string,
  filters: Electron.FileFilter[] = []
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    Recorder.mainWindow,
    { properties: ["openFile"], filters }
  );

  // if folder was selected
  if (!canceled && filePaths.length > 0) {
    await SettingHelper.saveSetting({
      key,
      value: filePaths[0],
    });
    return filePaths[0];
  }

  // if canceled, check DB if not return empty
  const setting = await SettingHelper.getSetting(key);
  return setting ? setting.value : "";
};

/**
 * Set a folder setting
 * @param event
 * @param key
 * @returns
 */
export const setFolderSetting = async (
  event: Electron.IpcMainInvokeEvent,
  key: string
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    Recorder.mainWindow,
    { properties: ["openDirectory"] }
  );

  // if folder was selected
  if (!canceled && filePaths.length > 0) {
    await SettingHelper.saveSetting({
      key,
      value: filePaths[0],
    });
    return filePaths[0];
  }

  // if canceled, check DB if not return empty
  const setting = await SettingHelper.getSetting(key);
  return setting ? setting.value : "";
};

/**
 * Save the recordings folder
 */
export const setRecordingsFolder = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    Recorder.mainWindow,
    { properties: ["openDirectory"] }
  );

  // if folder was selected
  if (!canceled && filePaths.length > 0) {
    // save the setting in local database
    await SettingHelper.saveSetting({
      key: "recordingsFolder",
      value: filePaths[0],
    });

    // set the audio recording singleton
    AudioRecordingSingleton.setInstance(
      new AudioRecording({
        outDir: filePaths[0],
      })
    );

    // return the recording file path
    return filePaths[0];
  }

  // if canceled, check DB if not return empty
  const setting = await SettingHelper.getSetting("recordingsFolder");
  return setting ? setting.value : "";
};
