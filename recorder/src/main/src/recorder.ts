import { ProcesStatus, Notifciation } from "@shared/interfaces";
import { BrowserWindow } from "electron";
import { AudioRecording } from "./lib/audio/AudioRecording";
import { AudioRecordingSingleton } from "./lib/audio/AudioRecordingSingleton";
import { getSerialPorts } from "./lib/serial/Serial";
import { SerialButton } from "./lib/serial/SerialButton";
import { SerialButtonSingleton } from "./lib/serial/SerialButtonSingleton";
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

    /**
     * Serial Button
     */

    const serialPorts = await getSerialPorts();
    const usbSerialPort = serialPorts.find((port) =>
      port.includes("usbserial")
    );
    if (usbSerialPort) {
      SerialButtonSingleton.setInstance(
        new SerialButton({
          path: usbSerialPort,
          onButtonUp: () => Recorder._mainWindow.webContents.send("next-vo"),
        })
      );
    }
  }

  public static changeProces(procesStatus: ProcesStatus) {
    Recorder._mainWindow.webContents.send("on-proces", procesStatus);
  }

  public static notifcation(notifcation: Notifciation) {
    Recorder._mainWindow.webContents.send("on-notification", notifcation);
  }
}
