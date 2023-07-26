import { ProcesStatus, Notification } from "@shared/interfaces";
import { BrowserWindow } from "electron";
import { AudioRecording } from "./lib/audio/AudioRecording";
import { AudioRecordingSingleton } from "./lib/audio/AudioRecordingSingleton";
import SettingHelper from "./lib/settings/SettingHelper";

/**
 * The app class
 */
export class Recorder {
  private static _mainWindow: BrowserWindow;

  /**
   * Getters & Setters
   */

  public static get mainWindow() {
    return Recorder._mainWindow;
  }

  public static set mainWindow(mainWindow: BrowserWindow) {
    Recorder._mainWindow = mainWindow;
  }

  /**
   * Logic
   */

  public static async initApplication() {
    /**
     * Audio Recording
     */

    const recordingsFolderSetting = await SettingHelper.getSetting(
      "recordingsFolder"
    );
    if (recordingsFolderSetting?.value)
      AudioRecordingSingleton.setInstance(
        new AudioRecording({
          outDir: recordingsFolderSetting.value,
        })
      );
  }

  public static changeProces(procesStatus: ProcesStatus) {
    Recorder.mainWindow.webContents.send("on-proces", procesStatus);
  }

  public static notification(notifcation: Notification) {
    Recorder.mainWindow.webContents.send("on-notification", notifcation);
  }
}
